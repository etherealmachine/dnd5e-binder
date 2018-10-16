import "core-js/library";
import * as React from 'react';

import TextField from '@material-ui/core/TextField';

export interface Props {
  name: string
  compendium: { [key: string]: any }
  renderCard: (props: any) => JSX.Element
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
      return [];
    }
    return Object.keys(this.props.compendium).filter((key) => key.toLowerCase().includes(this.state.query.toLowerCase()));
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
        {this.filterKeys().map((key) => {
          return <div key={key}>{this.props.renderCard({obj: this.props.compendium[key]})}</div>;
        })}
      </div>
    </div>;
  }
}

export default CompendiumTab;