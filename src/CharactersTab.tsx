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
  selected: number
  characters: CharacterState[]
  dispatch: Dispatch
}

class CharactersTab extends React.Component<Props> {

  public static mapStateToProps(state: State): Partial<Props> {
    return {
      selected: state.characters.selected,
      characters: state.characters.characters,
    };
  }

  public static mapDispatchToProps(dispatch: Dispatch): Partial<Props> {
    return { dispatch };
  }

  private handleCharacterSelectionChanged = (event: React.ChangeEvent<HTMLSelectElement>) => {
    this.props.dispatch({
      type: 'SELECT_CHARACTER',
      value: event.target.value,
    });
  }

  public render() {
    return <div>
      <FormControl>
        <InputLabel htmlFor="select-character">Character</InputLabel>
        <Select
          value={this.props.selected}
          inputProps={{
            name: 'character',
            id: 'select-character',
          }}
          onChange={this.handleCharacterSelectionChanged}>
          {this.props.characters.map((character, i) => {
            return <MenuItem key={i} value={i}>{character.character_name}</MenuItem>
          })}
          <MenuItem value={this.props.characters.length}><em>New Character</em></MenuItem>
        </Select>
      </FormControl>
      <CharacterSheet {...this.props.characters[this.props.selected]} dispatch={this.props.dispatch} />
    </div>;
  }
}

export default connect(CharactersTab.mapStateToProps, CharactersTab.mapDispatchToProps)(CharactersTab);