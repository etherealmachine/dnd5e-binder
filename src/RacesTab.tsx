import "core-js/library";
import * as React from 'react';
import {AutoSizer, Column, Table} from 'react-virtualized';
import { createStyles, WithStyles, withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';

import { State as AppState } from './store';
import TextField from '@material-ui/core/TextField';

export interface Props extends WithStyles<typeof styles> {
  compendium: { [key: string]: any }
}

interface State {
  query: string,
  list: any[],
}

const styles = createStyles({
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
});

class RacesTab extends React.Component<Props, State> {

  public constructor(props: Props) {
    super(props);
    this.state = {
      query: '',
      list: [],
    };
  }

  public static mapStateToProps(state: AppState): Partial<Props> {
    return {
      compendium: state.app.compendium.races,
    };
  }

  private handleSearchChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      query: event.currentTarget.value,
    });
  }

  private getTraits = ({rowData, dataKey}: {rowData?: any, dataKey: string}): string => {
    const traits = rowData[dataKey];
    if (!traits) {
      return ''
    }
    if (traits.hasOwnProperty('name')) {
      return traits.name;
    }
    return traits.map((trait: any) => trait.name).join(', ');
  }

  public render() {
    const { classes, compendium } = this.props;
    const { query } = this.state;
    const list = Object.values(compendium).filter((obj) => query === '' || obj.name.toLowerCase().includes(query.toLowerCase()));
    list.sort((a, b) => a.name.toLowerCase() <= b.name.toLowerCase() ? -1 : 1);
    return <div style={{display: 'flex', flexDirection: 'column', flex: '1'}}>
      <TextField
          label={`Search Races`}
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
                overscanRowCount={0}
                rowHeight={80}
                rowGetter={({index}: {index: number}) => list[index]}
                rowCount={list.length}
                width={width}>
              <Column
                label="name"
                cellDataGetter={({rowData}) => rowData.name}
                dataKey="name"
                width={250} />
              <Column
                disableSort
                label="size"
                dataKey="size"
                width={50} />
              <Column
                disableSort
                label="speed"
                dataKey="speed"
                width={70} />
              <Column
                disableSort
                label="ability"
                dataKey="ability"
                className={classes.wrap}
                flexGrow={1}
                width={0} />
              <Column
                disableSort
                label="proficiency"
                dataKey="proficiency"
                className={classes.wrap}
                flexGrow={1}
                width={1} />
              <Column
                disableSort
                label="traits"
                dataKey="trait"
                cellDataGetter={this.getTraits}
                className={classes.wrap}
                flexGrow={4}
                width={0} />
            </Table>
          )}
        </AutoSizer>
      </div>
    </div>;
  }
}

export default connect(RacesTab.mapStateToProps)(withStyles(styles)(RacesTab));