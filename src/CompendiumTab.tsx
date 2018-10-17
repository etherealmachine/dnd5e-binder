import "core-js/library";
import * as React from 'react';

import TextField from '@material-ui/core/TextField';
import ObjectCard from './ObjectCard';

export interface Props {
  name: string
  compendium: { [key: string]: any }
}

interface State {
  query: string
}

class CompendiumTab extends React.Component<Props, State> {

  public constructor(props: Props) {
    super(props);
    this.state = {
      query: ''
    };
  }

  private handleSearchChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      query: event.currentTarget.value || '',
    });
  }

  private filterKeys = () => {
    if (this.state.query === '') {
      return Object.keys(this.props.compendium).slice(0, 20);
    }
    return Object.keys(this.props.compendium).filter((key) => key.toLowerCase().includes(this.state.query.toLowerCase()));
  }

  public render() {
    return <div>
      <TextField
          label={`Search ${this.props.name}`}
          type="search"
          margin="normal"
          value={this.state.query}
          onChange={this.handleSearchChanged} />
      <div className="row flex-wrap">
        {this.filterKeys().map((key) => <ObjectCard key={key} obj={this.props.compendium[key]} />)}
      </div>
    </div>;
  }
}

export default CompendiumTab;