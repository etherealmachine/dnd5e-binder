import "core-js/library";
import * as React from 'react';
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
    display: 'flex',
    flexDirection: 'column',
    flex: '1',
    marginBottom: '20px',
  },
});

class RacesTab extends React.Component<Props, State> {

  public constructor(props: Props) {
    super(props);
    this.state = {
      query: '',
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

  private renderRace = (race: any, index: number): JSX.Element => {
    const content: JSX.Element[] = [];
    let traits = race.trait;
    if (!(traits instanceof Array)) {
      traits = [traits];
    }
    traits.forEach((trait: any) => {
      let text = trait.text;
      if (!(trait.text instanceof Array)) {
        text = [trait.text];
      }
      content.push(
        <p key={content.length}><span className="term">{trait.name}:</span>&nbsp;{(text as string[]).map((t, j) => <span key={j}>{t}<br /></span>)}</p>)
    });
    return <div key={index}>
      <h2>{race.name}</h2>
      <p><span className="term">Ability: {race.ability}</span></p>
      <p><span className="term">Size: {race.size}</span></p>
      <p><span className="term">Speed: {race.speed}</span></p>
      {content}
    </div>;
  }

  public render() {
    const { classes, compendium } = this.props;
    const { query } = this.state;
    const list = Object.values(compendium).filter((obj) => query === '' || obj.name.toLowerCase().includes(query.toLowerCase()));
    return <div className={classes.container}>
      <TextField
          label="Search Races"
          type="search"
          margin="normal"
          value={this.state.query}
          onChange={this.handleSearchChanged} />
      <div className={classes.table}>
        {list.map(this.renderRace)}
      </div>
    </div>;
  }
}

export default connect(RacesTab.mapStateToProps)(withStyles(styles)(RacesTab));