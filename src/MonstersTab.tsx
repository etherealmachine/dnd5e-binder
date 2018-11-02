import "core-js/library";
import * as React from 'react';
import ReactDOM from 'react-dom';
import { ArrowKeyStepper, AutoSizer, Column, Table, TableCellProps, TableCellDataGetterParams, ScrollIndices, SortDirection, SortDirectionType } from 'react-virtualized';
import { createStyles, WithStyles, withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';

import Compendium from './compendium';
import { State as AppState, store } from './store';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import MonsterCard from './MonsterCard';

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
    overflow: 'hidden',
  },
  wrap: {
    whiteSpace: 'normal',
  },
  highlight: {
    boxSizing: 'border-box',
    borderBottom: '1px solid #e0e0e0',
    cursor: 'pointer',
    backgroundColor: '#a9e7ff'
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
});

class MonstersTab extends React.Component<Props, State> {

  public constructor(props: Props) {
    super(props);
    this.state = {
      query: '',
    };
  }

  public static mapStateToProps(state: AppState): Partial<Props> {
    return {
      compendium: state.app.compendium.monsters,
    };
  }

  private handleSearchChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    // TODO: keep cache but use remapped index when filtering list.
    this.cache.clearAll();
    this.setState({
      query: event.currentTarget.value,
    });
  }

  private handleRowClick = ({event, index, rowData}: { event: React.MouseEvent<any>, index: number, rowData: any }) => {
    this.setState({ scrollToRow: index });
  }

  private onScrollToChange = (params: ScrollIndices) => {
    if (this.tableRef.current !== null) {
      const node = ReactDOM.findDOMNode(this.tableRef.current.Grid)
      if (node instanceof HTMLElement) node.focus();
    }
    this.setState({ scrollToRow: params.scrollToRow });
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

  private parseFirst = (value: string): number => {
    return (typeof(value) === 'string')? parseInt(value.split(' ')[0]) : value;
  }

  private compare = (sortBy: string, sortDirection: SortDirectionType) => {
    return (a: any, b: any) => {
      const direction = sortDirection === SortDirection.ASC ? 1 : -1;
      if (sortBy === 'hp' || sortBy === 'ac' || sortBy === 'cr' || sortBy === 'passive') {
        const aValue = this.parseFirst(a[sortBy] || '0');
        const bValue = this.parseFirst(b[sortBy] || '0');
        return aValue <= bValue ? -direction : direction;
      }
      return (a[sortBy] || '').toString().toLowerCase() <= (b[sortBy] || '').toString().toLowerCase() ? -direction : direction;
    };
  }

  private firstNumber = (p: TableCellDataGetterParams) => {
    const v = p.rowData[p.dataKey];
    return (typeof(v) === 'string')? v.split(' ')[0] : v;
  }

  private tableRef = React.createRef<Table>();

  public render() {
    const { classes, compendium } = this.props;
    const { query, sortBy, sortDirection, scrollToRow } = this.state;
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
              <ArrowKeyStepper
                  isControlled={true}
                  onScrollToChange={this.onScrollToChange}
                  columnCount={1}
                  mode="cells"
                  rowCount={list.length}
                  scrollToRow={scrollToRow}>
                  {({ onSectionRendered, scrollToColumn, scrollToRow }: { onSectionRendered: any, scrollToColumn: number, scrollToRow: number }) => (
                    <Table
                        ref={this.tableRef}
                        headerHeight={30}
                        height={height}
                        rowClassName={({index}: {index: number}) => (scrollToRow === index ? classes.highlight : index % 2 == 0 ? classes.row : classes.odd)}
                        noRowsRenderer={() => <div>No rows</div>}
                        rowHeight={80}
                        rowGetter={({index}: {index: number}) => list[index]}
                        rowCount={list.length}
                        onSectionRendered={onSectionRendered}
                        scrollToIndex={scrollToRow}
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
                        label="cr"
                        dataKey="cr"
                        flexGrow={1}
                        width={0} />
                      <Column
                        label="xp"
                        dataKey="cr"
                        cellDataGetter={(p: TableCellDataGetterParams) => Compendium.cr_to_xp[p.rowData[p.dataKey]]}
                        flexGrow={1}
                        width={0} />
                      <Column
                        label="hp"
                        dataKey="hp"
                        cellDataGetter={this.firstNumber}
                        flexGrow={1}
                        width={0} />
                      <Column
                        label="ac"
                        dataKey="ac"
                        className={classes.wrap}
                        cellDataGetter={this.firstNumber}
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
                      <Column
                        disableSort
                        label=""
                        dataKey="name"
                        cellRenderer={(col: TableCellProps) => <Button onClick={(event: React.MouseEvent<HTMLElement>) => {event.stopPropagation(); store.dispatch({type: 'ADD_TO_ENCOUNTER', monster: compendium[col.cellData]})}}>+</Button>}
                        width={50} />
                      </Table>
                  )}
              </ArrowKeyStepper>
            )}
          </AutoSizer>
        </div>
        {scrollToRow !== undefined && scrollToRow < list.length && <MonsterCard {...list[scrollToRow]} />}
      </div>
    </div>;
  }
}

export default connect(MonstersTab.mapStateToProps)(withStyles(styles)(MonstersTab));