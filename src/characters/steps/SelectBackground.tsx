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

class SelectBackground extends React.Component<Props> {

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
        return <div></div>;
    }
}

export default connect(SelectBackground.mapStateToProps, SelectBackground.mapDispatchToProps)(SelectBackground);
