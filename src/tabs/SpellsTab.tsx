import * as React from 'react';
import { Column, SortDirection, SortDirectionType } from 'react-virtualized';

import { Spell } from '../Compendium';
import SpellCard from '../cards/SpellCard';
import TableWithCard from '../TableWithCard';

export interface Props {
  spells: { [key: string]: Spell }
}

export default class SpellsTab extends React.Component<Props> {

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
    </TableWithCard>
  }
}
