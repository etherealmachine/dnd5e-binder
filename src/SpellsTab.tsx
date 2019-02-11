import "core-js/library";
import * as React from 'react';
import { Column, SortDirection, SortDirectionType, TableCellProps } from 'react-virtualized';
import { connect } from 'react-redux';

import IconButton from '@material-ui/core/IconButton';
import Plus from 'mdi-material-ui/Plus';
import { Spell } from './compendium';
import SpellCard from './SpellCard';
import { State as AppState, store } from './store';
import TableWithCard from './TableWithCard';

export interface Props {
  spells: { [key: string]: Spell }
}

class SpellsTab extends React.Component<Props> {

  public static mapStateToProps(state: AppState): Partial<Props> {
    return {
      spells: state.app.compendium.spells,
    };
  }

  private compare = (sortBy: string, sortDirection: SortDirectionType) => {
    return (a: any, b: any) => {
      const direction = sortDirection === SortDirection.ASC ? 1 : -1;
      return (a[sortBy] || '').toString().toLowerCase() <= (b[sortBy] || '').toString().toLowerCase() ? -direction : direction;
    };
  }

  public render() {
    const { spells } = this.props;
    return <TableWithCard
        name="Spells"
        items={spells}
        compare={this.compare}
        renderItemCard={(spell: Spell, handleCloseClicked: (event: React.MouseEvent) => void) => <SpellCard spell={spell} handleCloseClicked={handleCloseClicked} />}>
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
          className="wrap"
          flexGrow={1}
          width={0} />
      <Column
          label="school"
          dataKey="school"
          className="wrap"
          flexGrow={1}
          width={0} />
      <Column
          label="duration"
          dataKey="duration"
          className="wrap"
          flexGrow={1}
          width={0} />
      <Column
          label="time"
          dataKey="time"
          className="wrap"
          flexGrow={1}
          width={0} />
      <Column
          disableSort
          label=""
          dataKey="name"
          cellRenderer={(col: TableCellProps) => (
            <IconButton
                onClick={(event: React.MouseEvent<HTMLElement>) => {
                  event.stopPropagation();
                  store.dispatch({type: 'ADD_TO_CHARACTER', spell: spells[col.cellData]});
                }}>
              <Plus />
            </IconButton>
          )}
          width={50} />
    </TableWithCard>
  }
}

export default connect(SpellsTab.mapStateToProps)(SpellsTab);