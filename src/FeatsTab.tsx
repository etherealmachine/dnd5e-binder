import "core-js/library";
import * as React from 'react';
import { AutoSizer, Column, Table, TableCellProps, CellMeasurer, CellMeasurerCache, SortDirection, SortDirectionType } from 'react-virtualized';
import { createStyles, WithStyles, withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';

import { State as AppState, store } from './store';
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
  text: {
    padding: '10px 0',
    display: 'flex',
    flexDirection: 'column',
  }
});

class FeatsTab extends React.Component<Props, State> {

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
      compendium: state.app.compendium.feats,
    };
  }

  private handleSearchChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    // TODO: keep cache but use remapped index when filtering list.
    this.cache.clearAll();
    this.setState({
      query: event.currentTarget.value,
    });
  }

  private cache = new CellMeasurerCache({
    fixedWidth: true,
    minHeight: 25,
  });

  private renderText = ({cellData, dataKey, parent, rowIndex}: any): JSX.Element => {
    let content = <span></span>;
    if (cellData) {
      const { classes } = this.props;
      const text = cellData;
      if (text instanceof Array) {
        content = <div className={classes.text}>
          {text.filter((text: string) => text).map((line, i) => <div key={i}>{line}</div>)}
        </div>;
      } else {
        content = <span className={classes.text}>{text}</span>;
      }
    }
    return <CellMeasurer
        cache={this.cache}
        columnIndex={0}
        key={dataKey}
        parent={parent}
        rowIndex={rowIndex}>
      {content}
    </CellMeasurer>;
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
    return <div style={{display: 'flex', flexDirection: 'column', flex: '1'}}>
      <TextField
          label="Search Feats"
          type="search"
          margin="normal"
          value={this.state.query}
          onChange={this.handleSearchChanged} />
      <div style={{flex: '1', marginBottom: '20px'}}>
        <AutoSizer>
          {({height, width}) => (
            <Table
                headerHeight={30}
                height={height}
                rowClassName={({index}: {index: number}) => (index % 2 == 0 ? classes.row : classes.odd)}
                noRowsRenderer={() => <div>No rows</div>}
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
                width={250} />
              <Column
                label="prerequisite"
                dataKey="prerequisite"
                flexGrow={1}
                width={0} />
              <Column
                disableSort
                label="text"
                dataKey="text"
                cellRenderer={this.renderText}
                className={classes.wrap}
                flexGrow={4}
                width={0} />
              <Column
                disableSort
                label=""
                dataKey="name"
                cellRenderer={(col: TableCellProps) => <Button onClick={() => store.dispatch({type: 'ADD_TO_CHARACTER', feat: col.cellData})}>+</Button>}
                width={50} />
            </Table>
          )}
        </AutoSizer>
      </div>
    </div>;
  }
}

export default connect(FeatsTab.mapStateToProps)(withStyles(styles)(FeatsTab));