import "core-js/library";
import * as React from 'react';
import { AutoSizer, Column, Table, SortDirection, SortDirectionType } from 'react-virtualized';
import { createStyles, WithStyles, withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';

import { State as AppState } from './store';
import TextField from '@material-ui/core/TextField';

export interface Props extends WithStyles<typeof styles> {
  compendium: { [key: string]: any }
}

interface State {
  query: string,
  sortBy?: string,
  sortDirection?: SortDirectionType,
  displayedIndex?: number,
}

const styles = createStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    flex: '1',
  },
  table: {
    flex: '1',
    overflow: 'hidden',
  },
  wrap: {
    whiteSpace: 'normal',
  },
  row: {
    boxSizing: 'border-box',
    borderBottom: '1px solid #e0e0e0',
    cursor: 'pointer',
  },
  odd: {
    boxSizing: 'border-box',
    borderBottom: '1px solid #e0e0e0',
    backgroundColor: '#fafafa',
    cursor: 'pointer',
  },
  tableWithCard: {
    display: 'flex',
    flex: '1',
    marginBottom: '20px',
  },
  monsterCard: {
    width: '400px',
    overflow: 'hidden',
  },
});

class MonstersTab extends React.Component<Props, State> {

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
      compendium: state.app.compendium.monsters,
    };
  }

  private handleSearchChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    // TODO: keep cache but use remapped index when filtering list.
    this.setState({
      query: event.currentTarget.value,
    });
  }

  private handleRowClick = ({event, index, rowData}: { event: React.MouseEvent<any>, index: number, rowData: any }) => {
    this.setState({ displayedIndex: index });
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

  private renderMonsterCard = (monster: any) => {
    const { classes } = this.props;
    return <div className={classes.monsterCard}>{JSON.stringify(monster)}</div>;
  }

  public render() {
    const { classes, compendium } = this.props;
    const { query, sortBy, sortDirection, displayedIndex } = this.state;
    const list = Object.values(compendium).filter((obj) => query === '' || obj.name.toLowerCase().includes(query.toLowerCase()));
    list.sort(this.compare(sortBy || 'name', sortDirection || SortDirection.ASC));
    return <div className={classes.container}>
      <TextField
          label="Search Monsters"
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
                  onRowClick={this.handleRowClick}
                  width={width}
                  sort={this.sort}
                  sortBy={sortBy}
                  sortDirection={sortDirection}>
                <Column
                  label="name"
                  dataKey="name"
                  width={250} />
                <Column
                  label="hp"
                  dataKey="hp"
                  flexGrow={1}
                  width={0} />
                <Column
                  label="ac"
                  dataKey="ac"
                  className={classes.wrap}
                  flexGrow={1}
                  width={0} />
                <Column
                  label="size"
                  dataKey="size"
                  flexGrow={1}
                  width={0} />
                <Column
                  label="passive"
                  dataKey="passive"
                  flexGrow={1}
                  width={0} />
                <Column
                  label="skill"
                  dataKey="skill"
                  className={classes.wrap}
                  flexGrow={1}
                  width={0} />
                <Column
                  label="save"
                  dataKey="save"
                  className={classes.wrap}
                  flexGrow={1}
                  width={0} />
              </Table>
            )}
          </AutoSizer>
        </div>
        {displayedIndex !== undefined && this.renderMonsterCard(list[displayedIndex])}
      </div>
    </div>;
  }
}

export default connect(MonstersTab.mapStateToProps)(withStyles(styles)(MonstersTab));