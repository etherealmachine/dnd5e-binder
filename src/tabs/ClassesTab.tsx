import "core-js/library";
import * as React from 'react';
import { connect } from 'react-redux';

import { Class } from '../compendium';
import { State as AppState } from '../store';
import SearchableList from '../SearchableList';

import ClassCard from '../cards/ClassCard';


export interface Props {
    classes: { [key: string]: Class }
}

class ClassesTab extends React.Component<Props> {

    public static mapStateToProps(state: AppState): Partial<Props> {
        return {
            classes: state.app.compendium.classes,
        };
    }

    private renderClass = (clazz: any, index: number): JSX.Element => {
        return <ClassCard key={index} clazz={clazz} />;
    }

    public render() {
        const { classes } = this.props;
        return <SearchableList
            items={classes}
            renderItem={this.renderClass}
        />;
    }
}

export default connect(ClassesTab.mapStateToProps)(ClassesTab);