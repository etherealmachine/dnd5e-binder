import "core-js/library";
import * as React from 'react';

import { Race } from '../compendium';

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
                <p key={content.length}><span className="term">{trait.name}:</span>&nbsp;{(text as string[]).map((t, j) => <span key={j}>{t}<br /></span>)}</p>)
        });
        return <div>
            <h2>{race.name}</h2>
            <p><span className="term">Ability: {race.ability}</span></p>
            <p><span className="term">Size: {race.size}</span></p>
            <p><span className="term">Speed: {race.speed}</span></p>
            {content}
        </div>;
    }

}

export default RaceCard;