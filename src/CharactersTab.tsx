import "core-js/library";
import * as React from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';

import Button from '@material-ui/core/Button';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

import { State, CharacterState } from './store';
import CharacterSheet from './CharacterSheet';

export interface Props {
  selected: number
  characters: CharacterState[]
  dispatch: Dispatch
  classes: { [key: string]: string }
}

const styles = {
  actionContainer: {
    'margin-top': '10px',
    'justify-content': 'space-between',
  }
};

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

  public componentDidMount() {
    var query = window.location.search.substring(1);
    var vars = query.split('&');
    for (let i = 0; i < vars.length; i++) {
      const pair = vars[i].split('=');
      if (decodeURIComponent(pair[0]) === 'import_character') {
        this.props.dispatch({
          type: 'IMPORT_CHARACTER',
          value: JSON.parse(decodeURIComponent(pair[1])),
        });
        history.pushState(null, "", location.href.split("?")[0]);
      }
    }
  }

  private handleSelectionChanged = (event: React.ChangeEvent<HTMLSelectElement>) => {
    this.props.dispatch({
      type: 'SELECT_CHARACTER',
      value: event.target.value,
    });
  }

  private handleDelete = (event: React.MouseEvent<HTMLButtonElement>) => {
    this.props.dispatch({
      type: 'DELETE_CHARACTER',
    });
  }

  private handlePrint = (event: React.MouseEvent<HTMLButtonElement>) => {
    window.print();
  }

  private handleShare = (event: React.MouseEvent<HTMLButtonElement>) => {
    const el = document.createElement('textarea');
    el.value = window.location.href + '?import_character=' + encodeURIComponent(JSON.stringify(this.props.characters[this.props.selected]));
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  }

  public render() {
    return <div>
      <div className={classNames('row', this.props.classes.actionContainer)}>
        <div className="column">
          <InputLabel htmlFor="select-character">Character</InputLabel>
          <Select
            value={this.props.selected}
            inputProps={{
              name: 'character',
              id: 'select-character',
            }}
            onChange={this.handleSelectionChanged}>
            {this.props.characters.map((character, i) => {
              return <MenuItem key={i} value={i}>{character.character_name || "Unnamed Character"}</MenuItem>
            })}
            <MenuItem value={this.props.characters.length}><em>New Character</em></MenuItem>
          </Select>
        </div>
        <Button color="primary" onClick={this.handlePrint}>Print</Button>
        <Button onClick={this.handleShare}>Share</Button>
        <Button color="secondary" onClick={this.handleDelete}>Delete</Button>
      </div>
      <CharacterSheet {...this.props.characters[this.props.selected]} dispatch={this.props.dispatch} />
    </div>;
  }
}

export default connect(CharactersTab.mapStateToProps, CharactersTab.mapDispatchToProps)(withStyles(styles)(CharactersTab));