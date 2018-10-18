import "core-js/library";
import * as React from 'react';
import {AutoSizer, Column, Table} from 'react-virtualized';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';

import { State as AppState } from './store';
import TextField from '@material-ui/core/TextField';

export interface Props {
  name: string
  compendium: { [key: string]: any }
}

interface State {
  query: string,
  list: any[],
}

const styles = {
}

class ClassesTab extends React.Component<Props, State> {

  public constructor(props: Props) {
    super(props);
    this.state = {
      query: '',
      list: [],
    };
  }

  public static mapStateToProps(state: AppState): Partial<Props> {
    return {
      compendium: state.app.compendium.classes,
    };
  }

  private handleSearchChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      query: event.currentTarget.value,
    });
  }

  public render() {
    const list = Object.values(this.props.compendium).filter((obj) => this.state.query === '' || obj.name.toLowerCase().includes(this.state.query.toLowerCase()));
    list.sort((a, b) => a.name.toLowerCase() <= b.name.toLowerCase() ? -1 : 1);
    return <div style={{display: 'flex', flexDirection: 'column', flex: '1'}}>
      <TextField
          label={`Search ${this.props.name}`}
          type="search"
          margin="normal"
          value={this.state.query}
          onChange={this.handleSearchChanged} />
      <div style={{flex: '1', marginBottom: '20px', overflow: 'hidden'}}>
        <AutoSizer>
          {({height, width}) => (
            <Table
                ref="Table"
                className="Table"
                headerHeight={30}
                height={height}
                noRowsRenderer={() => <div>No rows</div>}
                overscanRowCount={10}
                rowHeight={40}
                rowGetter={({index}: {index: number}) => list[index]}
                rowCount={list.length}
                width={width}>
              <Column
                label="name"
                cellDataGetter={({rowData}) => rowData.name}
                dataKey="name"
                width={250} />
            </Table>
          )}
        </AutoSizer>
      </div>
    </div>;
  }
}

export default connect(ClassesTab.mapStateToProps)(withStyles(styles)(ClassesTab));