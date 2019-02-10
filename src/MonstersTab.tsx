import "core-js/library";
import * as React from 'react';
import { Column, TableCellProps, SortDirection, SortDirectionType, TableCellDataGetterParams } from 'react-virtualized';
import { connect } from 'react-redux';

import { Compendium, Monster } from './compendium';
import { State as AppState, store } from './store';
import Button from '@material-ui/core/Button';
import TableWithCard from './TableWithCard';
import MonsterCard from './MonsterCard';

export interface Props {
  monsters: { [key: string]: Monster }
}

class MonstersTab extends React.Component<Props> {

  public static mapStateToProps(state: AppState): Partial<Props> {
    return {
      monsters: state.app.compendium.monsters,
    };
  }

  private firstNumber = (p: TableCellDataGetterParams) => {
    const v = p.rowData[p.dataKey];
    return (typeof(v) === 'string')? v.split(' ')[0] : v;
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

  public render() {
    const { monsters } = this.props;
    return <TableWithCard
        name="Monsters"
        items={monsters}
        compare={this.compare}
        renderItemCard={(monster: Monster, handleCloseClicked: (event: React.MouseEvent) => void) => <MonsterCard monster={monster} handleCloseClicked={handleCloseClicked} />}>
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
          dataKey="xp"
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
          className="wrap"
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
          className="wrap"
          flexGrow={1}
          width={0} />
      <Column
          label="save"
          dataKey="save"
          className="wrap"
          flexGrow={1}
          width={0} />
      <Column
          disableSort
          label=""
          dataKey="name"
          cellRenderer={(col: TableCellProps) => (
            <Button
                onClick={(event: React.MouseEvent<HTMLElement>) => {
                  event.stopPropagation();
                  store.dispatch({type: 'ADD_TO_ENCOUNTER', monster: monsters[col.cellData]});
                }}>
              +
            </Button>
          )}
          width={50} />
    </TableWithCard>
  }
}

export default connect(MonstersTab.mapStateToProps)(MonstersTab);