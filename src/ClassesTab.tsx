import "core-js/library";
import * as React from 'react';
import { AutoSizer, Column, Table, CellMeasurer, CellMeasurerCache, SortDirection, SortDirectionType } from 'react-virtualized';
import { createStyles, WithStyles, withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';

import { State as AppState } from './store';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

export interface Props extends WithStyles<typeof styles> {
  compendium: { [key: string]: any }
}

interface State {
  query: string,
  sortBy?: string,
  sortDirection?: SortDirectionType,
}

const styles = createStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    flex: '1',
  },
  table: {
    flex: '1',
    marginBottom: '20px',
    overflow: 'hidden',
  },
  wrap: {
    whiteSpace: 'normal',
  },
  row: {
    boxSizing: 'border-box',
    borderBottom: '1px solid #e0e0e0',
  },
  odd: {
    boxSizing: 'border-box',
    borderBottom: '1px solid #e0e0e0',
    backgroundColor: '#fafafa',
  },
  features: {
    padding: '10px 0',
    display: 'flex',
    flexDirection: 'column',
  },
  featureName: {
    fontWeight: 600,
  },
});

interface Autolevel {
  slots?: string
  feature?: Feature | Feature[]
}

interface Feature {
  name: string
  text: string
}

class ClassesTab extends React.Component<Props, State> {

  public constructor(props: Props) {
    super(props);
    this.state = {
      query: '',
      sortBy: undefined,
      sortDirection: undefined,
    };
  }

  public static mapStateToProps(state: AppState): Partial<Props> {
    return {
      compendium: state.app.compendium.classes,
    };
  }

  private handleSearchChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.cache.clearAll();
    this.setState({
      query: event.currentTarget.value,
    });
  }

  private cache = new CellMeasurerCache({
    fixedWidth: true,
    minHeight: 25,
  });

  private renderFeatures = ({cellData, dataKey, parent, rowIndex}: any): JSX.Element => {
    const { classes } = this.props;
    const content: JSX.Element[] = [];
    if (cellData) {
      const autolevel = cellData;
      autolevel.filter((level: Autolevel) => level.feature).forEach((level: Autolevel) => {
        let features = level.feature || [];
        if (!(features instanceof Array)) {
          features = [features];
        }
        features.forEach(feature => {
          content.push(<span key={content.length}><span className={classes.featureName}>{feature.name}:</span> {feature.text}</span>)
        });
      });
    }
    return <CellMeasurer
        cache={this.cache}
        columnIndex={0}
        key={dataKey}
        parent={parent}
        rowIndex={rowIndex}>
      <div className={classes.features}>{content}</div>
    </CellMeasurer>;
  }

  private handleAddClick = (spellName: string) => (event: React.MouseEvent<HTMLElement>) => {
    console.log(spellName);
  }

  private renderAddButton = ({cellData, dataKey, parent, rowIndex}: any): JSX.Element => {
    return <Button onClick={this.handleAddClick(cellData)}>+</Button>;
  }

  private sort = ({sortBy, sortDirection}: {sortBy?: string, sortDirection?: SortDirectionType}) => {
    const {
      sortDirection: prevSortDirection
    } = this.state;
    this.cache.clearAll();

    // If list was sorted DESC by this column.
    // Rather than switch to ASC, return to "natural" order.
    if (prevSortDirection === SortDirection.DESC) {
      sortBy = undefined;
      sortDirection = undefined;
    }

    this.setState({ sortBy, sortDirection });
  }

  private compare = (sortBy: string, sortDirection: SortDirectionType) => {
    return (a: any, b: any) => {
      const direction = sortDirection === SortDirection.ASC ? 1 : -1;
      return a[sortBy].toString().toLowerCase() <= b[sortBy].toString().toLowerCase() ? -direction : direction;
    };
  }

  public render() {
    const { classes, compendium } = this.props;
    const { query, sortBy, sortDirection } = this.state;
    const list = Object.values(compendium).filter((obj) => query === '' || obj.name.toLowerCase().includes(query.toLowerCase()));
    list.sort(this.compare(sortBy || 'name', sortDirection || SortDirection.ASC));
    return <div className={classes.container}>
      <TextField
          label="Search Classes"
          type="search"
          margin="normal"
          value={this.state.query}
          onChange={this.handleSearchChanged} />
      <div className={classes.table}>
        <AutoSizer>
          {({height, width}) => (
            <Table
                headerHeight={30}
                height={height}
                noRowsRenderer={() => <div>No rows</div>}
                rowClassName={({index}: {index: number}) => (index % 2 == 0 ? classes.row : classes.odd)}
                rowHeight={this.cache.rowHeight}
                rowGetter={({index}: {index: number}) => list[index]}
                rowCount={list.length}
                width={width}
                sort={this.sort}
                sortBy={sortBy}
                sortDirection={sortDirection}>
              <Column
                label="name"
                cellDataGetter={({rowData}) => rowData.name}
                dataKey="name"
                flexGrow={1}
                width={0} />
              <Column
                label="hit dice"
                dataKey="hd"
                className={classes.wrap}
                flexGrow={1}
                width={0} />
              <Column
                label="proficiency"
                dataKey="proficiency"
                className={classes.wrap}
                flexGrow={1}
                width={0} />
              <Column
                label="spell ability"
                dataKey="spellAbility"
                className={classes.wrap}
                flexGrow={1}
                width={0} />
              <Column
                label="features"
                dataKey="autolevel"
                className={classes.wrap}
                cellRenderer={this.renderFeatures}
                flexGrow={4}
                width={0} />
              <Column
                disableSort
                label=""
                dataKey="name"
                cellRenderer={this.renderAddButton}
                width={50} />
            </Table>
          )}
        </AutoSizer>
      </div>
    </div>;
  }
}

export default connect(ClassesTab.mapStateToProps)(withStyles(styles)(ClassesTab));