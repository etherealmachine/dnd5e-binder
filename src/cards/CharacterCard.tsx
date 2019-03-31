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
    	const {
    		character_name,
    		race
    	} = this.props.character;
        return <Card className="card">
            <CardContent>
	            <Typography variant="h5">{character_name? character_name : 'Unnamed Character'}</Typography>
	            <Typography variant="body2">{race? race.name : ''}</Typography>
	            <Typography variant="body2">Size: {race? race.size : ''}</Typography>
	            <Typography variant="body2">Speed: {race? race.speed : ''}</Typography>
            </CardContent>
        </Card>;
    }

}

export default CharacterCard;