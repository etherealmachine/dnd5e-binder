import "core-js/library";
import * as React from 'react';
import { createStyles, WithStyles, withStyles } from '@material-ui/core/styles';

import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

export interface Props extends WithStyles<typeof styles> {
  name: string
  imageURL?: string
  cr: string
  ac: string
  hp: string
  passive: number
  size: string
  speed: string
  str: number
  dex: number
  con: number 
  int: string
  wis: number
  cha: number 
  alignment:string 
  type: string
  description?: string
  action?: {name: string, text: string}[]
  reaction?: {name: string, text: string}[]
  legendary?: {name: string, text: string}[]
  save?: string
  trait?: string
  languages?: string
  skill?: string
  resist?: string
  vulnerable?: string
  immune?: string
  conditionImmune?: string
  senses?: string
  spells?: true
  slots?: string
}

const styles = createStyles({
  card: {
    width: 400,
    margin: '0 20px',
  },
  media: {
    height: 140,
    backgroundPosition: 'center',
  },
});

class MonsterCard extends React.Component<Props> {

  public render() {
    const {
      name,
      imageURL,
      cr, ac, hp, passive,
      size, speed,
      str, dex, con, int, wis, cha,
      alignment,
      type,
      description,
      classes
    } = this.props;
    return <Card className={classes.card}>
      {imageURL && <CardMedia
        className={classes.media}
        image={imageURL}
        title={name}
      />}
      <CardContent>
        <Typography gutterBottom variant="h5">{name}</Typography>
        <Typography>CR: {cr}</Typography>
        <Typography>AC: {ac}</Typography>
        <Typography>HP: {hp}</Typography>
        <Typography>Passive: {passive}</Typography>
        <Typography>Size: {size}</Typography>
        <Typography>Speed: {speed}</Typography>
        <table>
          <thead>
            <tr>
              <th>Str</th>
              <th>Dex</th>
              <th>Con</th>
              <th>Int</th>
              <th>Wis</th>
              <th>Cha</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{str}</td>
              <td>{dex}</td>
              <td>{con}</td>
              <td>{int}</td>
              <td>{wis}</td>
              <td>{cha}</td>
            </tr>
          </tbody>
        </table>
        <Typography>Alignment: {alignment}</Typography>
        <Typography>Type: {type}</Typography>
        {description && <Typography>{description}</Typography>}
      </CardContent>
      <CardActions>
        <Button size="small" color="primary">
          Tag
        </Button>
      </CardActions>
    </Card>
  }
}

export default (withStyles(styles)(MonsterCard));