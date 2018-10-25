import "core-js/library";
import * as React from 'react';
import { createStyles, WithStyles, withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';

import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import Compendium from './compendium';
import { State, store } from './store';

export interface Props extends WithStyles<typeof styles> {
  id?: string
  name: string
  imageURL?: string
  cr: string | number
  ac: string | number
  hp: string | number
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
  action?: NameTextPair[] | NameTextPair
  reaction?: NameTextPair[] | NameTextPair
  legendary?: NameTextPair[] | NameTextPair
  save?: string
  trait?: NameTextPair[] | NameTextPair
  languages?: string
  skill?: string
  resist?: string
  vulnerable?: string
  immune?: string
  conditionImmune?: string
  senses?: string
  spells?: string
  slots?: string
  compendium: { [key: string]: any }
}

interface NameTextPair {
  name: string
  text: string
}

interface LocalState {
  id: string
  editing: boolean
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
});

class MonsterCard extends React.Component<Props, LocalState> {

  public constructor(props: Props) {
    super(props);
    this.state = {
      id: props.id || '',
      editing: false
    };
  }

  public static mapStateToProps(state: State): Partial<Props> {
    return {
      compendium: state.app.compendium.monsters,
    };
  }

  private renderActions = (actions: NameTextPair[] | NameTextPair | undefined) => {
    if (!actions) {
      return null;
    }
    if (!(actions instanceof Array)) {
      actions = [actions];
    }
    const { classes } = this.props;
    const content = actions.map((action, i) => {
      return <span key={`action-${i}`}><span className={classes.actionName}>{action.name}</span>: {action.text}</span>
    });
    return <div className={classes.action}>
      {content}
    </div>
  }

  private monsterInstance = () => {
    const monster = Object.assign({}, this.props.compendium[this.props.name]);
    monster.id = this.props.id;
    return monster;
  }

  private handleIDChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      id: event.currentTarget.value,
    })
  }

  private handleIDKeyPress = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter') {
      store.dispatch({
        type: 'UPDATE_ID',
        from: this.props.id,
        to: this.state.id,
      });
      this.setState({
        editing: false,
      });
    }
  }

  private handleIDClick = () => {
    this.setState({
      editing: true,
    });
  }

  public render() {
    const {
      id,
      name,
      imageURL,
      cr, ac, hp, passive,
      size, speed,
      str, dex, con, int, wis, cha,
      skill,
      senses,
      alignment,
      languages,
      type,
      description,
      action, reaction, legendary,
      trait,
      save,
      resist, vulnerable, immune, conditionImmune,
      spells, slots,
      classes,
    } = this.props;
    const actions = this.renderActions(action);
    const reactions = this.renderActions(reaction);
    const legendaryActions = this.renderActions(legendary);
    const traits = this.renderActions(trait);
    return <Card className={classes.card}>
      {imageURL && <CardMedia
        className={classes.media}
        image={imageURL}
        title={name}
      />}
      <CardContent>
        {id !== undefined && this.state.editing ?
          <TextField label="Name" value={this.state.id} onChange={this.handleIDChange} onKeyPress={this.handleIDKeyPress} /> :
          <Typography gutterBottom variant="h5" onClick={this.handleIDClick}>{id? id : name}</Typography>
        }
        <table>
          <thead>
            <tr>
              <th>CR</th>
              <th>XP</th>
              <th>AC</th>
              <th>HP</th>
              <th>Passive</th>
              <th>Size</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{cr}</td>
              <td>{Compendium.cr_to_xp[cr]}</td>
              <td>{(typeof(ac) === 'string')? ac.split(' ')[0] : ac}</td>
              <td>{(typeof(hp) === 'string')? hp.split(' ' )[0] : hp}</td>
              <td>{passive}</td>
              <td>{size}</td>
            </tr>
          </tbody>
        </table>
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
              <td>{Compendium.modifierText(Compendium.modifier(str))}</td>
              <td>{Compendium.modifierText(Compendium.modifier(dex))}</td>
              <td>{Compendium.modifierText(Compendium.modifier(con))}</td>
              <td>{Compendium.modifierText(Compendium.modifier(int))}</td>
              <td>{Compendium.modifierText(Compendium.modifier(wis))}</td>
              <td>{Compendium.modifierText(Compendium.modifier(cha))}</td>
            </tr>
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
        <Typography>Speed: {speed}</Typography>
        <Typography>Skills: {skill}</Typography>
        <Typography>Senses: {senses}</Typography>
        <Typography>Languages: {languages}</Typography>
        <Typography>Alignment: {alignment}</Typography>
        <Typography>Type: {type}</Typography>
        {description && <Typography>{description}</Typography>}
        {actions && <div>
          <Typography gutterBottom variant="h6">Actions</Typography>
          {actions}
        </div>}
        {reactions && <div>
          <Typography gutterBottom variant="h6">Reactions</Typography>
          {reactions}
        </div>}
        {legendaryActions && <div>
          <Typography gutterBottom variant="h6">Legendary Actions</Typography>
          {legendaryActions}
        </div>}
        {traits && <div>
          <Typography gutterBottom variant="h6">Traits</Typography>
          {traits}
        </div>}
        {save && <Typography>Save: {save}</Typography>}
        {resist && <Typography>Resist: {resist}</Typography>}
        {vulnerable && <Typography>Vulnerable: {vulnerable}</Typography>}
        {immune && <Typography>Immune: {immune}</Typography>}
        {conditionImmune && <Typography>Condition Immunities: {conditionImmune}</Typography>}
        {spells && <Typography>Spells: {spells}</Typography>}
        {slots && <Typography>Slots: {slots}</Typography>}
      </CardContent>
      <CardActions>
        {id === undefined && <Button size="small" color="primary" onClick={() => store.dispatch({type: 'ADD_TO_ENCOUNTER', monster: this.monsterInstance()})}>
          Add to Encounter
        </Button>}
        {id !== undefined && <Button size="small" color="secondary" onClick={() => store.dispatch({type: 'REMOVE_FROM_ENCOUNTER', monster: this.monsterInstance()})}>
          Remove from Encounter
        </Button>}
      </CardActions>
    </Card>
  }
}

export default connect(MonsterCard.mapStateToProps)(withStyles(styles)(MonsterCard));