import * as React from 'react';

import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Snackbar from '@material-ui/core/Snackbar';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import Toolbar from '@material-ui/core/Toolbar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';

import './App.css';
import Compendium from './Compendium';
import SpellsTab from './tabs/SpellsTab';
import ItemsTab from './tabs/ItemsTab';
import MonstersTab from './tabs/MonstersTab';
import BackgroundsTab from './tabs/BackgroundsTab';
import FeatsTab from './tabs/FeatsTab';
import ClassesTab from './tabs/ClassesTab';
import RacesTab from './tabs/RacesTab';
import EncounterTab from './tabs/EncounterTab';
import GameState from './GameState';

interface State {
  drawerOpen: boolean
  tabSelected: number
  game: GameState
  compendium: Compendium
  snackbarOpen: boolean
  snackbarMessage?: { key: number, message: string }
}

export default class App extends React.Component<{}, State> {

  private snackbarQueue: { key: number, message: string }[] = [];

  public constructor(props: {}) {
    super(props);
    const compendium = new Compendium();
    compendium.load().then(() => {
      this.setState({
        ...this.state,
        compendium: compendium,
      });
    });
    this.state = {
      drawerOpen: false,
      tabSelected: 0,
      compendium: compendium,
      game: new GameState(compendium, (game: GameState) => {
        this.setState({
          ...this.state,
          game: game,
        });
      }),
      snackbarOpen: false,
      snackbarMessage: undefined,
    };
  }

  private toggleDrawer = (open: boolean) => {
    return (event: React.MouseEvent<HTMLButtonElement>) => {
      this.setState({
        ...this.state,
        drawerOpen: !this.state.drawerOpen,
      });
    };
  }

  private selectTab = (event: React.MouseEvent<HTMLButtonElement>) => {
    const selectedTab = parseInt(event.currentTarget.dataset.tabindex || '0');
    this.setState({
      ...this.state,
      tabSelected: selectedTab,
    });
  }

  private handleTabChange = (event: React.ChangeEvent<{}>, value: number) => {
    this.setState({
      ...this.state,
      tabSelected: value,
    });
  }

  public addSnackbarMessage = (message: string) => {
    this.snackbarQueue.push({ message: message, key: new Date().getTime() });
    if (this.state.snackbarOpen) {
      this.setState({ snackbarOpen: false });
    } else {
      this.processSnackbarQueue();
    }
  }

  private handleSnackbarClosed = () => {
    this.setState({ snackbarOpen: false });
  }

  private handleSnackbarExited = () => {
    this.processSnackbarQueue();
  }

  private processSnackbarQueue = () => {
    if (this.snackbarQueue.length > 0) {
      this.setState({
        snackbarOpen: true,
        snackbarMessage: this.snackbarQueue.shift(),
      });
    }
  }

  public render() {
    return <div style={{ height: '100%' }} className="column">
      <AppBar position="static">
        <Toolbar className="justify-content-space-between">
          <IconButton color="inherit" aria-label="Menu" onClick={this.toggleDrawer(true)}>
            <MenuIcon />
          </IconButton>
          {!this.state.compendium.loaded && <CircularProgress color="secondary" />}
          <Tabs value={this.state.tabSelected} onChange={this.handleTabChange} className="flex-1">
            <Tab label="Spells" />
            <Tab label="Items" />
            <Tab label="Monsters" />
            <Tab label="Backgrounds" />
            <Tab label="Feats" />
            <Tab label="Classes" />
            <Tab label="Races" />
            <Tab label="Encounter" />
          </Tabs>
        </Toolbar>
      </AppBar>
      <SwipeableDrawer open={this.state.drawerOpen} onClose={this.toggleDrawer(false)} onOpen={this.toggleDrawer(true)}>
        <Typography className="align-self-center" variant="h5" style={{ marginTop: '5px' }}>D&amp;D Binder</Typography>
        <Button data-tabindex="0" onClick={this.selectTab} style={{ fontSize: '20px', textAlign: 'left' }}>Spells</Button>
        <Button data-tabindex="1" onClick={this.selectTab} style={{ fontSize: '20px', textAlign: 'left' }}>Items</Button>
        <Button data-tabindex="2" onClick={this.selectTab} style={{ fontSize: '20px', textAlign: 'left' }}>Monsters</Button>
        <Button data-tabindex="3" onClick={this.selectTab} style={{ fontSize: '20px', textAlign: 'left' }}>Backgrounds</Button>
        <Button data-tabindex="4" onClick={this.selectTab} style={{ fontSize: '20px', textAlign: 'left' }}>Feats</Button>
        <Button data-tabindex="5" onClick={this.selectTab} style={{ fontSize: '20px', textAlign: 'left' }}>Classes</Button>
        <Button data-tabindex="6" onClick={this.selectTab} style={{ fontSize: '20px', textAlign: 'left' }}>Races</Button>
        <Button data-tabindex="7" onClick={this.selectTab} style={{ fontSize: '20px', textAlign: 'left' }}>Encounter</Button>
      </SwipeableDrawer>
      <div className="container">
        {this.state.tabSelected === 0 && <SpellsTab spells={this.state.compendium.spells} />}
        {this.state.tabSelected === 1 && <ItemsTab items={this.state.compendium.items} />}
        {this.state.tabSelected === 2 && <MonstersTab monsters={this.state.compendium.monsters} />}
        {this.state.tabSelected === 3 && <BackgroundsTab backgrounds={this.state.compendium.backgrounds} />}
        {this.state.tabSelected === 4 && <FeatsTab feats={this.state.compendium.feats} />}
        {this.state.tabSelected === 5 && <ClassesTab classes={this.state.compendium.classes} />}
        {this.state.tabSelected === 6 && <RacesTab races={this.state.compendium.races} />}
        {this.state.tabSelected === 7 && <EncounterTab game={this.state.game} />}
      </div>
      {this.state.snackbarMessage !== undefined && <Snackbar
        key={this.state.snackbarMessage.key}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        open={this.state.snackbarOpen}
        onClose={this.handleSnackbarClosed}
        onExited={this.handleSnackbarExited}
        autoHideDuration={3000}
        ContentProps={{
          'aria-describedby': 'snackbar-message',
        }}
        message={<span id="snackbar-message">{this.state.snackbarMessage.message}</span>} />}
    </div>;
  }
}
