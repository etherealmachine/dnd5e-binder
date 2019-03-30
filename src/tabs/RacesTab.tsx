import "core-js/library";
import * as React from 'react';
import { connect } from 'react-redux';

import { Race } from '../compendium';
import RaceCard from '../cards/RaceCard';
import { State as AppState } from '../store';
import SearchableList from '../SearchableList';

export interface Props {
    races: { [key: string]: Race }
}

class RacesTab extends React.Component<Props> {

    public static mapStateToProps(state: AppState): Partial<Props> {
        return {
            races: state.app.compendium.races,
        };
    }

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

export default connect(RacesTab.mapStateToProps)(RacesTab);