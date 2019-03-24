import "core-js/library";
import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import Compendium from '../../compendium';
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
}

interface State extends Partial<CharacterState> {
    selectedRace: string
}

class SelectRace extends React.Component<Props, State> {

    public constructor(props: Props) {
        super(props);
        const state = {
            selectedRace: ''
        };
        Object.assign(state, props);
        this.state = state;
    }


    public static mapStateToProps(state: AppState): Partial<Props> {
        return {
            compendium: state.app.compendium,
        };
    }

    public static mapDispatchToProps(dispatch: Dispatch): Partial<Props> {
        return {
            dispatch: dispatch,
        };
    }

    private handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
      this.setState({
        selectedRace: event.target.value,
      });
    }

    public render() {
        const { races } = this.props.compendium;
        const sortedRaces = Object.keys(races).sort();
        const selectedRace = this.state.selectedRace? races[this.state.selectedRace] : null;
        return <div style={{display: 'flex', flexDirection: 'column'}}>
          <FormControl style={{maxWidth: '300px'}}>
            <InputLabel htmlFor="race">Race</InputLabel>
            <Select
                value={this.state.selectedRace}
                onChange={this.handleChange}>
                {sortedRaces.map((race, i) => { return <MenuItem key={i} value={race}>{race}</MenuItem> })}
            </Select>
          </FormControl>
          {selectedRace? <RaceCard race={selectedRace} /> : null}
        </div>;
    }
}

export default connect(SelectRace.mapStateToProps, SelectRace.mapDispatchToProps)(SelectRace);
