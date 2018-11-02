import "core-js/library";
import * as React from 'react';
import { AutoSizer, Column, Table, TableCellProps, SortDirection, SortDirectionType } from 'react-virtualized';
import { createStyles, WithStyles, withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';

import { State as AppState, store } from './store';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import SpellCard from './SpellCard';

export interface Props extends WithStyles<typeof styles> {
  compendium: { [key: string]: any }
}

interface State {
  query: string,
  sortBy?: string,
  sortDirection?: SortDirectionType,
  scrollToRow?: number,
}

const styles = createStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    flex: '1',
  },
  tableWithCard: {
    display: 'flex',
    flex: '1',
    marginBottom: '20px',
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

class SpellsTab extends React.Component<Props, State> {

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
      compendium: state.app.compendium.spells,
    };
  }

  private handleSearchChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      query: event.currentTarget.value,
    });
  }

  private sort = ({sortBy, sortDirection}: {sortBy?: string, sortDirection?: SortDirectionType}) => {
    const {
      sortDirection: prevSortDirection
    } = this.state;

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
    const { query, sortBy, sortDirection, scrollToRow } = this.state;
    const list = Object.values(compendium).filter((obj) => query === '' || obj.name.toLowerCase().includes(query.toLowerCase()));
    list.sort(this.compare(sortBy || 'name', sortDirection || SortDirection.ASC));
    return <div className={classes.container}>
      <TextField
          label="Search Spells"
          type="search"
          margin="normal"
          value={this.state.query}
          onChange={this.handleSearchChanged} />
      <div className={classes.tableWithCard}>
        <div className={classes.table}>
          <AutoSizer>
            {({height, width}) => (
              <Table
                  headerHeight={30}
                  height={height}
                  rowClassName={({index}: {index: number}) => (index % 2 == 0 ? classes.row : classes.odd)}
                  noRowsRenderer={() => <div>No rows</div>}
                  rowHeight={80}
                  rowGetter={({index}: {index: number}) => list[index]}
                  rowCount={list.length}
                  width={width}
                  sort={this.sort}
                  sortBy={sortBy}
                  sortDirection={sortDirection}>
                <Column
                  label="name"
                  dataKey="name"
                  width={250} />
                <Column
                  label="level"
                  dataKey="level"
                  width={70} />
                <Column
                  label="classes"
                  dataKey="classes"
                  className={classes.wrap}
                  flexGrow={1}
                  width={0} />
                <Column
                  label="school"
                  dataKey="school"
                  className={classes.wrap}
                  flexGrow={1}
                  width={0} />
                <Column
                  label="duration"
                  dataKey="duration"
                  className={classes.wrap}
                  flexGrow={1}
                  width={0} />
                <Column
                  label="time"
                  dataKey="time"
                  className={classes.wrap}
                  flexGrow={1}
                  width={0} />
                <Column
                  disableSort
                  label=""
                  dataKey="name"
                  cellRenderer={(col: TableCellProps) => <Button onClick={() => store.dispatch({type: 'ADD_TO_CHARACTER', spell: col.cellData})}>+</Button>}
                  width={50} />
              </Table>
            )}
          </AutoSizer>
        </div>
        {scrollToRow !== undefined && scrollToRow < list.length && <SpellCard {...list[scrollToRow]} />}
      </div>
    </div>;
  }
}

export default connect(SpellsTab.mapStateToProps)(withStyles(styles)(SpellsTab));