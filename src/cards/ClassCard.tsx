import "core-js/library";
import * as React from 'react';

import { Class, Autolevel } from '../compendium';

import Typography from '@material-ui/core/Typography';

export interface Props {
    clazz: Class
}

class ClassCard extends React.Component<Props> {

    public render() {
    	const { clazz } = this.props;
        const content: JSX.Element[] = [];
        const autolevel = clazz.autolevel;
        autolevel.filter((level: Autolevel) => level.feature).forEach((level: Autolevel) => {
            let features = level.feature || [];
            if (!(features instanceof Array)) {
                features = [features];
            }
            features.forEach(feature => {
                let text = feature.text;
                if (!(feature.text instanceof Array)) {
                    text = [feature.text];
                }
                const textNodes = (text as string[]).map((t, j) => <span key={j}>{t}<br /></span>);
                content.push(
                    <Typography key={content.length}>
                    	<span className="term">{feature.name}:</span>&nbsp;{textNodes}
                    </Typography>
                );
            });
        });
        return <div>
            <h2>{clazz.name}</h2>
            <Typography><span className="term">Hit Die: {clazz.hd}</span></Typography>
            <Typography><span className="term">Proficiency: {clazz.proficiency}</span></Typography>
            <Typography>{clazz.spellAbility && <span><span className="term">Spell Ability:</span>&nbsp;{clazz.spellAbility}</span>}</Typography>
            {content}
        </div>;
    }

}

export default ClassCard;