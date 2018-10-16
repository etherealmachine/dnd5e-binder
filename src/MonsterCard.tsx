import "core-js/library";
import * as React from 'react';
import { withStyles } from '@material-ui/core/styles';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

import './CharacterSheet.css';
import { Monster, MapPairs, KeyValuePair, KeyValuePairList } from './compendium';

const styles = {
  card: {
  	display: 'flex',
  	'flex-direction': 'column',
    maxWidth: 345,
    margin: 10,
    padding: 15,
  },
  media: {
  	'background-size': 'contain',
    height: 140,
  },
};

export interface Props {
  classes: { [key: string]: string }
  obj: Monster
}

class MonsterCard extends React.Component<Props> {

  private renderList(name: string, pairs: KeyValuePairList): JSX.Element | undefined {
    if (pairs === undefined) {
      return undefined;
    }
    return <div>
      <Typography variant="subtitle1">{name}</Typography>
      {MapPairs(pairs, (pair: KeyValuePair, i: number) => {
        return <Typography key={`${name}-${i}`} component="p">{pair.name}: {pair.text}</Typography>;
      })}
    </div>;
  }

  public render() {
  	const { classes, obj } = this.props;
  	return <Card className={classes.card}>
      <CardContent>
        <Typography gutterBottom variant="h4">{obj.name}</Typography>
        {obj.cr && <Typography component="p">CR: {obj.cr}</Typography>}
        {obj.ac && <Typography component="p">AC: {obj.ac}</Typography>}
        {obj.hp && <Typography component="p">HP: {obj.hp}</Typography>}
        {obj.passive && <Typography component="p">Passive Perception: {obj.passive}</Typography>}
        {obj.description && <Typography component="p">Description: {obj.description}</Typography>}
        {obj.size && <Typography component="p">Size: {obj.size}</Typography>}
        {obj.speed && <Typography component="p">Speed: {obj.speed}</Typography>}
        {obj.alignment && <Typography component="p">Alignment: {obj.alignment}</Typography>}
        {obj.str && <Typography component="p">Str: {obj.str}</Typography>}
        {obj.con && <Typography component="p">Con: {obj.con}</Typography>}
        {obj.dex && <Typography component="p">Dex: {obj.dex}</Typography>}
        {obj.int && <Typography component="p">Int: {obj.int}</Typography>}
        {obj.wis && <Typography component="p">Wis: {obj.wis}</Typography>}
        {obj.cha && <Typography component="p">Cha: {obj.cha}</Typography>}
        {this.renderList('Actions', obj.action)}
        {this.renderList('Reactions', obj.reaction)}
        {this.renderList('Legendary Actions', obj.legendary)}
        {obj.save && <Typography component="p">Save: {obj.save}</Typography>}
        {obj.resist && <Typography component="p">Resist: {obj.resist}</Typography>}
        {obj.immune && <Typography component="p">Immunities: {obj.immune}</Typography>}
        {obj.conditionImmune && <Typography component="p">Condition Immunities: {obj.conditionImmune}</Typography>}
        {obj.vulnerable && <Typography component="p">Vulnerabilities: {obj.vulnerable}</Typography>}
        {obj.languages && <Typography component="p">Languages: {obj.languages}</Typography>}
        {obj.senses && <Typography component="p">Senses: {obj.senses}</Typography>}
        {obj.skill && <Typography component="p">Skills: {obj.skill}</Typography>}
        {obj.type && <Typography component="p">Type: {obj.type}</Typography>}
        {this.renderList('Traits', obj.trait)}
        {obj.spells && <Typography component="p">Spells: {obj.spells}</Typography>}
        {obj.slots && <Typography component="p">Slots: {obj.slots}</Typography>}
      </CardContent>
    </Card>;
  }
}

export default withStyles(styles)(MonsterCard);