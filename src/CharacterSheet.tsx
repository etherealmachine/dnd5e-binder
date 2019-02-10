import "core-js/library";
import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import { State as AppState } from './store';
import Compendium from './compendium';
import { CharacterState } from './store';

export interface Props extends CharacterState {
  compendium: Compendium
  dispatch: Dispatch
}

interface State {
}

class CharacterSheet extends React.Component<Props, State> {

  public constructor(props: Props) {
    super(props);
    this.state = {};
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

  public render() {
    return (
      <div>
      </div>
    );
  }
}

export default connect(CharacterSheet.mapStateToProps, CharacterSheet.mapDispatchToProps)(CharacterSheet);
