import "core-js/library";
import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import Compendium from '../../compendium';
import { Class } from '../../compendium';
import { CharacterState } from '../../store';
import { State as AppState } from '../../store';

import ClassCard from '../../cards/ClassCard';

import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';

export interface Props extends CharacterState {
    compendium: Compendium
    dispatch: Dispatch
}

interface State {
    selectedClass?: Class
}

class SelectClass extends React.Component<Props, State> {

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

    private handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        this.setState({
            selectedClass: this.props.compendium.classes[event.target.value],
        });
    }

    public render() {
        const { classes } = this.props.compendium;
        const sortedClasses = Object.keys(classes).sort();
        return <div style={{display: 'flex', flexDirection: 'column'}}>
          <FormControl style={{maxWidth: '300px'}}>
            <InputLabel htmlFor="class">Class</InputLabel>
            <Select
                value={this.state.selectedClass? this.state.selectedClass.name : ''}
                onChange={this.handleChange}>
                {sortedClasses.map((clazz, i) => { return <MenuItem key={i} value={clazz}>{clazz}</MenuItem> })}
            </Select>
          </FormControl>
          {this.state.selectedClass? <ClassCard clazz={this.state.selectedClass} /> : null}
        </div>;
        return <div></div>;
    }
}

export default connect(SelectClass.mapStateToProps, SelectClass.mapDispatchToProps)(SelectClass);
