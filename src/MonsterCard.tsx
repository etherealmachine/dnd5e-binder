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

export interface Props extends Monster {
  classes: { [key: string]: string }
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
  	const { classes } = this.props;
  	const name = this.props.name? this.props.name : 'Unknown Monster';
  	return <Card className={classes.card}>
      <CardContent>
        <Typography gutterBottom variant="h4">{name}</Typography>
        {this.props.cr && <Typography component="p">CR: {this.props.cr}</Typography>}
        {this.props.ac && <Typography component="p">AC: {this.props.ac}</Typography>}
        {this.props.hp && <Typography component="p">HP: {this.props.hp}</Typography>}
        {this.props.passive && <Typography component="p">Passive Perception: {this.props.passive}</Typography>}
        {this.props.description && <Typography component="p">Description: {this.props.description}</Typography>}
        {this.props.size && <Typography component="p">Size: {this.props.size}</Typography>}
        {this.props.speed && <Typography component="p">Speed: {this.props.speed}</Typography>}
        {this.props.alignment && <Typography component="p">Alignment: {this.props.alignment}</Typography>}
        {this.props.str && <Typography component="p">Str: {this.props.str}</Typography>}
        {this.props.con && <Typography component="p">Con: {this.props.con}</Typography>}
        {this.props.dex && <Typography component="p">Dex: {this.props.dex}</Typography>}
        {this.props.int && <Typography component="p">Int: {this.props.int}</Typography>}
        {this.props.wis && <Typography component="p">Wis: {this.props.wis}</Typography>}
        {this.props.cha && <Typography component="p">Cha: {this.props.cha}</Typography>}
        {this.renderList('Actions', this.props.action)}
        {this.renderList('Reactions', this.props.reaction)}
        {this.renderList('Legendary Actions', this.props.legendary)}
        {this.props.save && <Typography component="p">Save: {this.props.save}</Typography>}
        {this.props.resist && <Typography component="p">Resist: {this.props.resist}</Typography>}
        {this.props.immune && <Typography component="p">Immunities: {this.props.immune}</Typography>}
        {this.props.conditionImmune && <Typography component="p">Condition Immunities: {this.props.conditionImmune}</Typography>}
        {this.props.vulnerable && <Typography component="p">Vulnerabilities: {this.props.vulnerable}</Typography>}
        {this.props.languages && <Typography component="p">Languages: {this.props.languages}</Typography>}
        {this.props.senses && <Typography component="p">Senses: {this.props.senses}</Typography>}
        {this.props.skill && <Typography component="p">Skills: {this.props.skill}</Typography>}
        {this.props.type && <Typography component="p">Type: {this.props.type}</Typography>}
        {this.renderList('Traits', this.props.trait)}
        {this.props.spells && <Typography component="p">Spells: {this.props.spells}</Typography>}
        {this.props.slots && <Typography component="p">Slots: {this.props.slots}</Typography>}
      </CardContent>
    </Card>;
  }
}

export default withStyles(styles)(MonsterCard);