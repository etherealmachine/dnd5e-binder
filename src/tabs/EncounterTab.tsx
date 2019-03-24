import "core-js/library";
import * as React from 'react';
import { createStyles, WithStyles, withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';

import { State } from '../store';
import { Monster } from '../compendium';
import AddPlayerCard from '../cards/AddPlayerCard';
import MonsterCard from '../cards/MonsterCard';

export interface Props extends WithStyles<typeof styles> {
    monsters: Monster[],
}

const styles = createStyles({
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    }
});

class EncounterTab extends React.Component<Props> {

    public static mapStateToProps(state: State): Partial<Props> {
        return {
            monsters: state.encounter.monsters,
        };
    }

    public render() {
        const { monsters, classes } = this.props;
        return <div className={classes.container}>
            {monsters.map((monster, i) => <MonsterCard key={i} monster={monster} />)}
            <AddPlayerCard />
        </div>;
    }
}

export default connect(EncounterTab.mapStateToProps)(withStyles(styles)(EncounterTab));