import "core-js/library";
import * as React from 'react';
import Async from 'react-promise';

import TextField from '@material-ui/core/TextField';

export interface Props {
  name: string
  compendium: LocalForage
  renderCard: (props: any) => JSX.Element
}

interface State {
  query: string
}

class CompendiumTab extends React.Component<Props, State> {

  public constructor(props: Props) {
    super(props);
    this.state = {
      query: '',
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
          label={`Search ${this.props.name}s`}
          type="search"
          margin="normal"
          value={this.state.query}
          onChange={this.handleSearchChanged} />
      <div className="row flex-wrap">
        <Async
            promise={this.props.compendium.keys()}
            then={keys => keys.filter((key) => key.toLowerCase().includes(this.state.query.toLowerCase())).map((key) => {
              return <Async key={key}
                promise={this.props.compendium.getItem(key)}
                then={val => this.props.renderCard(val)} />})}
        />
      </div>
    </div>;
  }
}

export default CompendiumTab;