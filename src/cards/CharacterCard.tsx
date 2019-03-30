import "core-js/library";
import * as React from 'react';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

import { CharacterState } from '../store';

export interface Props {
    character: CharacterState
}

class CharacterCard extends React.Component<Props> {

    public render() {
        return <Card>
            <CardContent>
            <Typography variant="h2">{this.props.character.character_name}</Typography>
            </CardContent>
        </Card>;
    }

}

export default CharacterCard;