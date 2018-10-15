import "core-js/library";
import * as React from 'react';
import { withStyles } from '@material-ui/core/styles';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

import './CharacterSheet.css';
import { Spell } from './compendium';

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

export interface Props extends Spell {
  classes: { [key: string]: string }
}

class SpellCard extends React.Component<Props> {

  public constructor(props: Props) {
    super(props);
  }

  public render() {
  	const { classes } = this.props;
  	const name = this.props.name === undefined? 'Unknown Spell' : this.props.name[0];
  	return <Card className={classes.card}>
      <CardContent>
        <Typography gutterBottom variant="h5" component="h2">{name}</Typography>
      </CardContent>
    </Card>;
  }
}

export default withStyles(styles)(SpellCard);