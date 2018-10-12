import "core-js/library";
import * as React from 'react';
import Async from 'react-promise';

import TextField from '@material-ui/core/TextField';

import Compendium from './compendium';
import MonsterCard, { Props as MonsterCardProps } from './MonsterCard';

interface State {
  query: string
}

class MonstersTab extends React.Component<any, State> {

  public constructor(props: any) {
    super(props);
    this.state = {
      query: 'Goblin',
    };
  }

  private handleSearchChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      query: event.currentTarget.value,
    });
  }

  public render() {
    return <div>
      <TextField
          label="Monster Search"
          type="search"
          margin="normal"
          value={this.state.query}
          onChange={this.handleSearchChanged} />
      <div className="row flex-wrap">
        <Async
            promise={Compendium.monsters.keys()}
            then={keys => keys.filter((key) => key.toLowerCase().includes(this.state.query.toLowerCase())).map((key) => {
              return <Async key={key}
                promise={Compendium.monsters.getItem(key)}
                then={val => <MonsterCard {...((val as unknown) as MonsterCardProps)} />} />})}
        />
      </div>
    </div>;
  }
}

export default MonstersTab;