import "core-js/library";
import * as React from 'react';
import { connect } from 'react-redux';

import Button from '@material-ui/core/Button';
import { Race } from './compendium';
import { State as AppState } from './store';
import SearchableList from './SearchableList';

export interface Props {
  races: { [key: string]: Race }
}

class RacesTab extends React.Component<Props> {

  public static mapStateToProps(state: AppState): Partial<Props> {
    return {
      races: state.app.compendium.races,
    };
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
      <Button>Add To Character</Button>
    </div>;
  }

  public render() {
    const { races } = this.props;
    return <SearchableList
      items={races}
      renderItem={this.renderRace}
    />;
  }
}

export default connect(RacesTab.mapStateToProps)(RacesTab);