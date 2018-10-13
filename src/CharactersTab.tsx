import "core-js/library";
import * as React from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';

import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

import { State, CharacterState } from './store';
import CharacterSheet from './CharacterSheet';

export interface Props {
  character: CharacterState
  characters: CharacterState[]
  dispatch: Dispatch
}

class CharactersTab extends React.Component<Props> {

  public static mapStateToProps(state: State): Partial<Props> {
    return {
      character: state.character,
      characters: state.characters,
    };
  }

  public static mapDispatchToProps(dispatch: Dispatch): Partial<Props> {
    return { dispatch };
  }

  public render() {
    return <div>
      <FormControl>
        <InputLabel htmlFor="select-character">Character</InputLabel>
        <Select
          value={1}
          inputProps={{
            name: 'character',
            id: 'select-character',
          }}>
          <MenuItem value={0}><em>New Character</em></MenuItem>
        </Select>
      </FormControl>
      <CharacterSheet {...this.props.character} dispatch={this.props.dispatch} />
    </div>;
  }
}

export default connect(CharactersTab.mapStateToProps, CharactersTab.mapDispatchToProps)(CharactersTab);