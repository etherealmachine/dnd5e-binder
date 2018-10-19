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
}

const styles = createStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    flex: '1',
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
    overflow: 'scroll',
  }
});

class ClassesTab extends React.Component<Props, State> {

  public constructor(props: Props) {
    super(props);
    this.state = {
      query: '',
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
    const { classes, compendium } = this.props;
    const { query } = this.state;
    const list = Object.values(compendium).filter((obj) => query === '' || obj.name.toLowerCase().includes(query.toLowerCase()));
    list.sort((a, b) => a.name.toLowerCase() <= b.name.toLowerCase() ? -1 : 1);
    return <div className={classes.container}>
      <TextField
          label="Search Classes"
          type="search"
          margin="normal"
          value={this.state.query}
          onChange={this.handleSearchChanged} />
      <div className={classes.table}>
        <AutoSizer>
          {({height, width}) => (
            <Table
                headerHeight={30}
                height={height}
                noRowsRenderer={() => <div>No rows</div>}
                rowClassName={({index}: {index: number}) => (index % 2 == 0 ? classes.row : classes.odd)}
                rowHeight={40}
                rowGetter={({index}: {index: number}) => list[index]}
                rowCount={list.length}
                width={width}>
              <Column
                label="name"
                cellDataGetter={({rowData}) => rowData.name}
                dataKey="name"
                flexGrow={1}
                width={0} />
              <Column
                label="hd"
                dataKey="hd"
                className={classes.wrap}
                flexGrow={1}
                width={0} />
              <Column
                label="proficiency"
                dataKey="proficiency"
                className={classes.wrap}
                flexGrow={1}
                width={0} />
              <Column
                label="spell ability"
                dataKey="spellAbility"
                className={classes.wrap}
                flexGrow={1}
                width={0} />
            </Table>
          )}
        </AutoSizer>
      </div>
    </div>;
  }
}

export default connect(ClassesTab.mapStateToProps)(withStyles(styles)(ClassesTab));