import "core-js/library";
import * as React from 'react';

import { Race } from '../compendium';

import Typography from '@material-ui/core/Typography';

export interface Props {
    race: Race
}

class RaceCard extends React.Component<Props> {

    public render() {
    	const { race } = this.props;
        const content: JSX.Element[] = [];
        let traits = race.trait;
        if (!(traits instanceof Array)) {
            traits = [traits];
        }
        traits.forEach((trait: any) => {
            let text = trait.text;
            if (!(trait.text instanceof Array)) {
                text = [trait.text];
            }
            content.push(
                <div key={content.length}>
                    <Typography variant="subtitle2">{trait.name}</Typography>
                    <Typography>&nbsp;{(text as string[]).map((t, j) => <span key={j}>{t}<br /></span>)}</Typography>
                </div>
            );
        });
        return <div>
            <Typography variant="h5">{race.name}</Typography>
            <Typography>Ability: {race.ability}</Typography>
            <Typography>Size: {race.size}</Typography>
            <Typography>Speed: {race.speed}</Typography>
            {content}
        </div>;
    }

}

export default RaceCard;