import * as React from 'react';
import { Column, SortDirection, SortDirectionType } from 'react-virtualized';

import { Item } from '../Compendium';
import ItemCard from '../cards/ItemCard';
import TableWithCard from '../TableWithCard';

export interface Props {
  items: { [key: string]: Item }
}

export default class ItemsTab extends React.Component<Props> {

  private parseValue = (value: string): number => {
    if (value.includes('cp')) {
      return parseInt(value.split('cp')[0]) / 100;
    }
    if (value.includes('sp')) {
      return parseInt(value.split('sp')[0]) / 10;
    }
    if (value.includes('ep')) {
      return parseInt(value.split('ep')[0]) / 2;
    }
    if (value.includes('gp')) {
      return parseInt(value.split('gp')[0]);
    }
    if (value.includes('pp')) {
      return 10 * parseInt(value.split('pp')[0]);
    }
    return NaN;
  }

  private compare = (sortBy: string, sortDirection: SortDirectionType) => {
    return (a: any, b: any) => {
      const direction = sortDirection === SortDirection.ASC ? 1 : -1;
      if (sortBy === 'value') {
        const aValue = this.parseValue(a.value || '0gp');
        const bValue = this.parseValue(b.value || '0gp');
        return aValue <= bValue ? -direction : direction;
      }
      return (a[sortBy] || '').toString().toLowerCase() <= (b[sortBy] || '').toString().toLowerCase() ? -direction : direction;
    };
  }

  private renderItemCard = (item: Item, handleCloseClicked: (event: React.MouseEvent) => void) => {
    return <ItemCard item={item} handleCloseClicked={handleCloseClicked} />
  }

  public render() {
    const { items } = this.props;
    return <TableWithCard
      name="Items"
      items={items}
      renderItemCard={this.renderItemCard}
      compare={this.compare}>
      <Column
        label="name"
        dataKey="name"
        width={250} />
      <Column
        label="range"
        dataKey="range"
        flexGrow={1}
        className="wrap"
        width={0} />
      <Column
        label="damage"
        dataKey="dmg1"
        flexGrow={1}
        className="wrap"
        width={0} />
      <Column
        label="type"
        dataKey="dmgType"
        flexGrow={1}
        className="wrap"
        width={0} />
      <Column
        label="value"
        dataKey="value"
        flexGrow={1}
        className="wrap"
        width={0} />
      <Column
        label="ac"
        dataKey="ac"
        flexGrow={1}
        className="wrap"
        width={0} />
    </TableWithCard>
  }
}
