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
        return <Typography key={`${name}-${i}`}>{pair.name}: {pair.text}</Typography>;
      })}
    </div>;
  }

  public render() {
  	const { classes, obj } = this.props;
  	return <Card className={classes.card}>
      <CardContent>
        <Typography variant="h6">{obj.name}</Typography>
        {obj.cr && <Typography>CR: {obj.cr}</Typography>}
        {obj.ac && <Typography>AC: {obj.ac}</Typography>}
        {obj.hp && <Typography>HP: {obj.hp}</Typography>}
        {obj.passive && <Typography>Passive Perception: {obj.passive}</Typography>}
        {obj.description && <Typography>Description: {obj.description}</Typography>}
        {obj.size && <Typography>Size: {obj.size}</Typography>}
        {obj.speed && <Typography>Speed: {obj.speed}</Typography>}
        {obj.alignment && <Typography>Alignment: {obj.alignment}</Typography>}
        {obj.str && <Typography>Str: {obj.str}</Typography>}
        {obj.con && <Typography>Con: {obj.con}</Typography>}
        {obj.dex && <Typography>Dex: {obj.dex}</Typography>}
        {obj.int && <Typography>Int: {obj.int}</Typography>}
        {obj.wis && <Typography>Wis: {obj.wis}</Typography>}
        {obj.cha && <Typography>Cha: {obj.cha}</Typography>}
        {this.renderList('Actions', obj.action)}
        {this.renderList('Reactions', obj.reaction)}
        {this.renderList('Legendary Actions', obj.legendary)}
        {obj.save && <Typography>Save: {obj.save}</Typography>}
        {obj.resist && <Typography>Resist: {obj.resist}</Typography>}
        {obj.immune && <Typography>Immunities: {obj.immune}</Typography>}
        {obj.conditionImmune && <Typography>Condition Immunities: {obj.conditionImmune}</Typography>}
        {obj.vulnerable && <Typography>Vulnerabilities: {obj.vulnerable}</Typography>}
        {obj.languages && <Typography>Languages: {obj.languages}</Typography>}
        {obj.senses && <Typography>Senses: {obj.senses}</Typography>}
        {obj.skill && <Typography>Skills: {obj.skill}</Typography>}
        {obj.type && <Typography>Type: {obj.type}</Typography>}
        {this.renderList('Traits', obj.trait)}
        {obj.spells && <Typography>Spells: {obj.spells}</Typography>}
        {obj.slots && <Typography>Slots: {obj.slots}</Typography>}
      </CardContent>
    </Card>;
  }
}

export default withStyles(styles)(MonsterCard);