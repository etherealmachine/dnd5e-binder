import * as React from 'react';
import { createStyles, WithStyles, withStyles } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Close from 'mdi-material-ui/Close';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';

import { Spell } from '../Compendium';

export interface Props extends WithStyles<typeof styles> {
  spell: Spell
  handleCloseClicked?: (event: React.MouseEvent) => void
}

const styles = createStyles({
  card: {
    width: 400,
    margin: '10px 20px',
    overflowY: 'auto',
  },
  media: {
    height: 140,
    backgroundPosition: 'center',
  },
  action: {
    display: 'flex',
    flexDirection: 'column',
  },
  actionName: {
    fontWeight: 600,
  },
  h5InputParent: {
    width: '100%',
    marginBottom: '10px',
  },
  h5Input: {
    width: '100%',
    color: 'rgba(0, 0, 0, 0.87)',
    fontSize: '1.5rem',
    fontWeight: 400,
    lineHeight: '1.33',
    letterSpacing: '0em',
    paddingTop: '3px',
    marginBottom: '2.4px',
    padding: '0',
  },
  table: {
    textAlign: 'center',
  },
  numberInputParent: {
    maxWidth: '2em',
    alignSelf: 'center',
  },
  titleRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '8px',
  },
});

class SpellCard extends React.Component<Props> {

  private renderText(text: string[] | string) {
    if (!(text instanceof Array)) {
      text = [text];
    }
    return text.map((line, i) => <Typography key={i}>{line}</Typography>);
  }

  public render() {
    const { classes, spell, handleCloseClicked } = this.props;
    return <Card className={classes.card}>
      <CardContent>
        <div className={classes.titleRow}>
          <Typography variant="h5">{spell.name}</Typography>
          {handleCloseClicked && <IconButton onClick={handleCloseClicked}><Close /></IconButton>}
        </div>
        <Typography>Level: {spell.level}</Typography>
        <Typography>Classes: {spell.classes}</Typography>
        <Typography>Time: {spell.time}</Typography>
        <Typography>Duration: {spell.duration}</Typography>
        <Typography>Range: {spell.range}</Typography>
        <Typography>Components: {spell.components}</Typography>
        <Typography>School: {spell.school}</Typography>
        {this.renderText(spell.text)}
      </CardContent>
      <CardActions>
        <Button color="primary">Add To Character</Button>
      </CardActions>
    </Card>
  }
}

export default withStyles(styles)(SpellCard);
