import "core-js/library";
import * as React from 'react';
import { withStyles } from '@material-ui/core/styles';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';

import './CharacterSheet.css';
import { Monster } from './compendium';

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

  public constructor(props: Props) {
    super(props);
  }

  public render() {
  	const { classes } = this.props;
  	const name = this.props.name === undefined? 'Unknown Monster' : this.props.name[0];
  	return <Card className={classes.card}>
      <CardMedia className={classes.media} image={`images/${name}.jpg`} title={name} />
      <CardContent>
        <Typography gutterBottom variant="h5" component="h2">{name}</Typography>
        {this.props.cr !== undefined && <Typography component="p">CR: {this.props.cr[0]}</Typography>}
        {this.props.ac !== undefined && <Typography component="p">AC: {this.props.ac[0]}</Typography>}
        {this.props.hp !== undefined && <Typography component="p">HP: {this.props.hp[0]}</Typography>}
        {this.props.passive !== undefined && <Typography component="p">Passive Perception: {this.props.passive[0]}</Typography>}
        {this.props.description !== undefined && <Typography component="p">Description: {this.props.description[0]}</Typography>}
        {this.props.size !== undefined && <Typography component="p">Size: {this.props.size[0]}</Typography>}
        {this.props.speed !== undefined && <Typography component="p">Speed: {this.props.speed[0]}</Typography>}
        {this.props.alignment !== undefined && <Typography component="p">Alignment: {this.props.alignment[0]}</Typography>}
        {this.props.str !== undefined && <Typography component="p">Str: {this.props.str[0]}</Typography>}
        {this.props.con !== undefined && <Typography component="p">Con: {this.props.con[0]}</Typography>}
        {this.props.dex !== undefined && <Typography component="p">Dex: {this.props.dex[0]}</Typography>}
        {this.props.int !== undefined && <Typography component="p">Int: {this.props.int[0]}</Typography>}
        {this.props.wis !== undefined && <Typography component="p">Wis: {this.props.wis[0]}</Typography>}
        {this.props.cha !== undefined && <Typography component="p">Cha: {this.props.cha[0]}</Typography>}
        {this.props.action !== undefined && <Typography variant="subheading">Actions</Typography>}
        {this.props.action !== undefined && this.props.action.map((action, i) => {
          return <Typography key={`action-${i}`} component="p">{action.name}: {action.text}</Typography>
        })}
        {this.props.reaction !== undefined && <Typography variant="subheading">Reactions</Typography>}
        {this.props.reaction !== undefined && this.props.reaction.map((action, i) => {
          return <Typography key={`reaction-${i}`} component="p">{action.name}: {action.text}</Typography>
        })}
        {this.props.legendary !== undefined && <Typography variant="subheading">Legendary Actions</Typography>}
        {this.props.legendary !== undefined && this.props.legendary.map((action, i) => {
          return <Typography key={`legandary-action-${i}`} component="p">{action.name}: {action.text}</Typography>
        })}
        {this.props.save !== undefined && <Typography component="p">Save: {this.props.save[0]}</Typography>}
        {this.props.resist !== undefined && <Typography component="p">Resist: {this.props.resist[0]}</Typography>}
        {this.props.immune !== undefined && <Typography component="p">Immunities: {this.props.immune[0]}</Typography>}
        {this.props.conditionImmune !== undefined && <Typography component="p">Condition Immunities: {this.props.conditionImmune[0]}</Typography>}
        {this.props.vulnerable !== undefined && <Typography component="p">Vulnerabilities: {this.props.vulnerable[0]}</Typography>}
        {this.props.languages !== undefined && <Typography component="p">Languages: {this.props.languages[0]}</Typography>}
        {this.props.senses !== undefined && <Typography component="p">Senses: {this.props.senses[0]}</Typography>}
        {this.props.skill !== undefined && <Typography component="p">Skills: {this.props.skill[0]}</Typography>}
        {this.props.type !== undefined && <Typography component="p">Type: {this.props.type[0]}</Typography>}
        {this.props.trait != undefined && this.props.trait.map((trait, i) => {
          return <Typography key={`trait-${i}`} component="p">{trait.name}: {trait.text}</Typography>
        })}
        {this.props.spells !== undefined && <Typography component="p">Spells: {this.props.spells[0]}</Typography>}
        {this.props.slots !== undefined && <Typography component="p">Slots: {this.props.slots[0]}</Typography>}
      </CardContent>
    </Card>;
  }
}

export default withStyles(styles)(MonsterCard);