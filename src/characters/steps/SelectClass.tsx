import "core-js/library";
import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import Compendium from '../../compendium';
import { Class } from '../../compendium';
import { State as AppState } from '../../store';

import ClassCard from '../../cards/ClassCard';

import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';

export interface Props {
    compendium: Compendium
    dispatch: Dispatch
    selectedClass?: Class
}

class SelectClass extends React.Component<Props> {

    public static mapStateToProps(state: AppState): Partial<Props> {
        const classes = state.characters.characters[state.characters.selected].classes;
        return {
            compendium: state.app.compendium,
            selectedClass: classes? classes[0] : undefined,
        };
    }

    public static mapDispatchToProps(dispatch: Dispatch): Partial<Props> {
        return {
            dispatch: dispatch,
        };
    }

    private handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        this.props.dispatch({
            type: 'SELECT_CLASS',
            class: this.props.compendium.classes[event.target.value],
        });
    }

    public render() {
        const { classes } = this.props.compendium;
        const sortedClasses = Object.keys(classes).sort();
        return <div style={{display: 'flex', flexDirection: 'column'}}>
          <FormControl style={{maxWidth: '300px'}}>
            <InputLabel htmlFor="class">Class</InputLabel>
            <Select
                value={this.props.selectedClass? this.props.selectedClass.name : ''}
                onChange={this.handleChange}>
                {sortedClasses.map((clazz, i) => { return <MenuItem key={i} value={clazz}>{clazz}</MenuItem> })}
            </Select>
          </FormControl>
          {this.props.selectedClass? <ClassCard clazz={this.props.selectedClass} /> : null}
        </div>;
        return <div></div>;
    }
}

export default connect(SelectClass.mapStateToProps, SelectClass.mapDispatchToProps)(SelectClass);
