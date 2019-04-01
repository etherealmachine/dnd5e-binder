import "core-js/library";
import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import Compendium from '../../compendium';
import { CharacterState } from '../../store';
import { State as AppState } from '../../store';

import TextField from '@material-ui/core/TextField';

export interface Props {
    compendium: Compendium
    dispatch: Dispatch
    character: CharacterState
}

class SelectName extends React.Component<Props> {

    public static mapStateToProps(state: AppState): Partial<Props> {
        return {
            compendium: state.app.compendium,
            character: state.characters.characters[state.characters.selected],
        };
    }

    public static mapDispatchToProps(dispatch: Dispatch): Partial<Props> {
        return {
            dispatch: dispatch,
        };
    }

    private handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        this.props.dispatch({
            type: 'FIELD_CHANGE',
            key: 'character_name',
            value: event.target.value,
        });
    }

    public render() {
        return <TextField
            label="Character Name"
            type="text"
            value={this.props.character.character_name}
            onChange={this.handleChange}
        />;
    }
}

export default connect(SelectName.mapStateToProps, SelectName.mapDispatchToProps)(SelectName);
