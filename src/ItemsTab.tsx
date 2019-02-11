import "core-js/library";
import * as React from 'react';
import { Column, SortDirection, SortDirectionType, TableCellProps } from 'react-virtualized';
import { connect } from 'react-redux';

import IconButton from '@material-ui/core/IconButton';
import { Item } from './compendium';
import ItemCard from './ItemCard';
import Plus from 'mdi-material-ui/Plus';
import { State as AppState, store } from './store';
import TableWithCard from './TableWithCard';

export interface Props {
  items: { [key: string]: Item }
}

class ItemsTab extends React.Component<Props> {

  public static mapStateToProps(state: AppState): Partial<Props> {
    return {
      items: state.app.compendium.items,
    };
  }

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

  private handleAddItemClicked = (event: React.MouseEvent) => {
    event.stopPropagation();
    store.dispatch({
      type: 'ADD_ITEM',
      item: event.currentTarget.getAttribute('data-item'),
    });
  }

  private renderAddItemButton = (col: TableCellProps) => {
    return <IconButton
        onClick={this.handleAddItemClicked}
        data-item={col.cellData}>
      <Plus />
    </IconButton>;
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
      <Column
        disableSort
        label=""
        dataKey="name"
        cellRenderer={this.renderAddItemButton}
        width={50} />
    </TableWithCard>
  }
}

export default connect(ItemsTab.mapStateToProps)(ItemsTab);