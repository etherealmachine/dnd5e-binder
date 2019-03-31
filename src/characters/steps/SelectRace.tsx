import "core-js/library";
import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import Compendium from '../../compendium';
import { Race } from '../../compendium';
import { CharacterState } from '../../store';
import { State as AppState } from '../../store';

import RaceCard from '../../cards/RaceCard';

import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';

export interface Props extends CharacterState {
    compendium: Compendium
    dispatch: Dispatch
    race?: Race
}

class SelectRace extends React.Component<Props> {

    public static mapStateToProps(state: AppState): Partial<Props> {
        return {
            compendium: state.app.compendium,
            race: state.characters.characters[state.characters.selected].race,
        };
    }

    public static mapDispatchToProps(dispatch: Dispatch): Partial<Props> {
        return {
            dispatch: dispatch,
        };
    }

    private handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        this.props.dispatch({
            type: 'SET_RACE',
            race: this.props.compendium.races[event.target.value],
        });
    }

    public render() {
        const { races } = this.props.compendium;
        const sortedRaces = Object.keys(races).sort();
        return <div style={{display: 'flex', flexDirection: 'column'}}>
          <FormControl style={{maxWidth: '300px'}}>
            <InputLabel htmlFor="race">Race</InputLabel>
            <Select
                value={this.props.race? this.props.race.name : ''}
                onChange={this.handleChange}>
                {sortedRaces.map((race, i) => { return <MenuItem key={i} value={race}>{race}</MenuItem> })}
            </Select>
          </FormControl>
          {this.props.race? <RaceCard race={this.props.race} /> : null}
        </div>;
    }
}

export default connect(SelectRace.mapStateToProps, SelectRace.mapDispatchToProps)(SelectRace);
