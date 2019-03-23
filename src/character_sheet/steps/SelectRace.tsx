import "core-js/library";
import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import Compendium from '../../compendium';
import { CharacterState } from '../../store';
import { State as AppState } from '../../store';

export interface Props extends CharacterState {
  compendium: Compendium
  dispatch: Dispatch
}

class SelectRace extends React.Component<Props> {

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
  	const { races } = this.props.compendium;
    return <div>
    	{Object.keys(races).map((raceName) => {return <div>{raceName}</div>;})}
    </div>;
  }
}

export default connect(SelectRace.mapStateToProps, SelectRace.mapDispatchToProps)(SelectRace);
