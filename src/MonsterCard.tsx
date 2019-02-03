import "core-js/library";
import * as React from 'react';
import { createStyles, WithStyles, withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import classNames from 'classnames';

import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Dice6 from 'mdi-material-ui/Dice6';
import DiceD20 from 'mdi-material-ui/DiceD20';
import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import Typography from '@material-ui/core/Typography';

import { Compendium, Monster, NameTextPair } from './compendium';
import { State, store } from './store';

export interface Props extends WithStyles<typeof styles> {
  monster: Monster
  monsters: { [key: string]: Monster }
}

interface LocalState {
  editableProps: { [key: string]: any }
  editingName: boolean
  rolls: { [key: string]: number }
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
  iconButton: {
    padding: 0,
  },
});

class MonsterCard extends React.Component<Props, LocalState> {

  inputRef = React.createRef<HTMLInputElement>();

  public constructor(props: Props) {
    super(props);
    this.state = {
      editableProps: {
        id: props.monster.id || '',
        initiative: props.monster.initiative || '',
        currentHP: props.monster.currentHP || '',
      },
      editingName: false,
      rolls: {},
    };
  }

  public componentWillMount() {
    document.addEventListener('mousedown', this.handleClick, false);
  }

  public componentWillUnmount() {
    store.dispatch({
      type: 'UPDATE_MONSTER',
      id: this.props.monster.id,
      newValues: this.state.editableProps,
    });
    this.setState({
      editingName: false,
    });
    document.removeEventListener('mousedown', this.handleClick, false);
  }

  public static mapStateToProps(state: State): Partial<Props> {
    return {
      monsters: state.app.compendium.monsters,
    };
  }

  private roll = (dice: number, sides: number, modifier: number) => {
    let total = 0;
    for (let i = 0; i < dice; i++) {
      total += Math.floor(Math.random()*sides);
    }
    return total + modifier;
  }

  private renderAction = (action: NameTextPair, i: number) => {
    const toHitModifierRe = (action.text && action.text.match) ? action.text.match(/\+(\d+) to hit/) : null;
    const rollRe = (action.text && action.text.match) ? action.text.match(/(\d+)d(\d+)\s*\+\s*(\d+)/) : null;
    return <span key={`action-${i}`}>
      <span>
        <span className={this.props.classes.actionName}>{action.name}</span>: {action.text}
      </span>
      {toHitModifierRe !== null &&
        <IconButton
            className={this.props.classes.iconButton}
            onClick={(event: React.MouseEvent) => {
              const roll = this.roll(1, 20, parseInt(toHitModifierRe[1]));
              this.state.rolls[action.name+' Attack'] = roll;
              this.setState({rolls: this.state.rolls});
            }}>
          <DiceD20 />
          {this.state.rolls[action.name+' Attack'] && <span>{this.state.rolls[action.name+' Attack']}</span>}
        </IconButton>
      }
      {rollRe !== null &&
        <IconButton
            className={this.props.classes.iconButton}
            onClick={(event: React.MouseEvent) => {
              const roll = this.roll(parseInt(rollRe[1]), parseInt(rollRe[2]), parseInt(rollRe[3]));
              this.state.rolls[action.name+' Roll'] = roll;
              this.setState({rolls: this.state.rolls});
            }}>
          <Dice6 />
          {this.state.rolls[action.name+' Roll'] && <span>{this.state.rolls[action.name+' Roll']}</span>}
        </IconButton>
      }
    </span>;
  }

  private renderActions = (actions: NameTextPair[] | NameTextPair | undefined) => {
    if (!actions) {
      return null;
    }
    if (!(actions instanceof Array)) {
      actions = [actions];
    }
    const content = actions.map(this.renderAction)
    return <div className={this.props.classes.action}>
      {content}
    </div>
  }

  private renderInitiativeTracker = () => {
    return <div className="column align-self-flex-end" style={{minWidth: '110px'}}>
      <label htmlFor="initiative" className="align-self-center">Initiative</label>
      <div className="row align-self-center">
        <Input
            name="initiative"
            className={this.props.classes.numberInputParent}
            onChange={this.handleChange('initiative')}
            onKeyPress={this.handleKeyPress('initiative')}
            type={'number'}
            value={this.state.editableProps.initiative}
        />
        <IconButton onClick={this.rollInitiative} className={this.props.classes.iconButton}>
          <Dice6 />
        </IconButton>
      </div>
    </div>;
  }

  private renderCurrentHP = () => {
    return <div className="column align-self-flex-end" style={{minWidth: '110px'}}>
      <label htmlFor="currentHP" className="align-self-center">Current HP</label>
      <Input
          name="currentHP"
          className={this.props.classes.numberInputParent}
          onChange={this.handleChange('currentHP')}
          onKeyPress={this.handleKeyPress('currentHP')}
          type={'number'}
          value={this.state.editableProps.currentHP}
      />
    </div>;
  }

  private monsterInstance = () => {
    const monster = Object.assign({}, this.props.monsters[this.props.monster.name]);
    monster.id = this.props.monster.id;
    return monster;
  }

  private handleChange = (prop: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const props = this.state.editableProps;
    props[prop] = event.currentTarget.value;
    this.setState({
      editableProps: props,
    });
  }

  private rollInitiative = () => {
    const initiative = Math.floor(Math.random()*20)+Compendium.modifier(this.props.monster.dex);
    this.state.editableProps.initiative = initiative;
    store.dispatch({
        type: 'UPDATE_MONSTER',
        id: this.props.monster.id,
        newValues: this.state.editableProps,
    });
    this.setState({
      editableProps: this.state.editableProps,
    });
  }

  private handleKeyPress = (prop: string) => (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter') {
      store.dispatch({
        type: 'UPDATE_MONSTER',
        id: this.props.monster.id,
        newValues: this.state.editableProps,
      });
      this.setState({
        editingName: false,
      });
    }
  }

  private handleClick = (e: any) => {
    if (this.inputRef.current !== e.target) {
      store.dispatch({
        type: 'UPDATE_MONSTER',
        id: this.props.monster.id,
        newValues: this.state.editableProps,
      });
      this.setState({
        editingName: false,
      });
    }
  }

  private handleIDClick = () => {
    this.setState({
      editingName: true,
    });
  }

  public render() {
    const { classes, monster } = this.props;
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
    } = monster;
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
        {id !== undefined && this.state.editingName ?
          <Input
              autoFocus={true}
              inputRef={this.inputRef}
              value={this.state.editableProps.id}
              onChange={this.handleChange('id')}
              onKeyPress={this.handleKeyPress('id')}
              className={classes.h5InputParent}
              classes={{input: classes.h5Input}}
          /> :
          <Typography gutterBottom variant="h5" onClick={this.handleIDClick}>{id? id : name}</Typography>
        }
        <div className="row justify-content-space-around">
          <table className={classNames("flex-1", classes.table)}>
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
          {id !== undefined && this.renderInitiativeTracker()}
        </div>
        <div className="row">
          <table className={classNames("flex-1", classes.table)}>
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
          {id !== undefined && this.renderCurrentHP()}
        </div>
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

// connect is not working welll with type inference
interface PassedProps {
  monster: Monster
}

const component: () => React.Component<PassedProps> = (connect(MonsterCard.mapStateToProps)(withStyles(styles)(MonsterCard)) as any);
export default component;