import * as React from 'react';

import { Race } from '../Compendium';
import RaceCard from '../cards/RaceCard';
import SearchableList from '../SearchableList';

export interface Props {
  races: { [key: string]: Race }
}

export default class RacesTab extends React.Component<Props> {

  private renderRace = (race: Race, index: number): JSX.Element => {
    return <RaceCard key={index} race={race} />;
  }

  public render() {
    const { races } = this.props;
    return <SearchableList
      items={races}
      renderItem={this.renderRace}
    />;
  }
}
