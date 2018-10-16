import "core-js/library";
import * as React from 'react';
import { withStyles } from '@material-ui/core/styles';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

import './CharacterSheet.css';
import { Item } from './compendium';

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
  obj: Item
}

class ItemCard extends React.Component<Props> {

  public constructor(props: Props) {
    super(props);
  }

  public render() {
  	const { classes, obj } = this.props;
  	return <Card className={classes.card}>
      <CardContent>
        <Typography gutterBottom component="h2">{obj.name}</Typography>
      </CardContent>
    </Card>;
  }
}

export default withStyles(styles)(ItemCard);