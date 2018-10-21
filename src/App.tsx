import "core-js/library";
import * as React from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';

import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import Toolbar from '@material-ui/core/Toolbar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import './App.css';
import { State } from './store';
import Compendium from './compendium';
import CharactersTab from './CharactersTab';
import SpellsTab from './SpellsTab';
import ItemsTab from './ItemsTab';
import MonstersTab from './MonstersTab';
import BackgroundsTab from './BackgroundsTab';
import FeatsTab from './FeatsTab';
import ClassesTab from './ClassesTab';
import RacesTab from './RacesTab';
import EncounterTab from './EncounterTab';

export interface Props {
  drawerOpen: boolean
  tabSelected: number
  signedIn: boolean
  compendium: Compendium
  compendiumLoading: boolean
  dispatch: Dispatch
}

const CLIENT_ID = '196165648382-s1585cq9b97a2tn9ulfg4ffkbvqgmaf9.apps.googleusercontent.com';
const API_KEY = 'AIzaSyC8bv7XruOjzLHA3FvBWB3LJONSZXL3Asc';
const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"];
const SCOPES = 'https://www.googleapis.com/auth/drive.metadata.readonly https://www.googleapis.com/auth/drive.file';
let gapi = window['gapi'];

class App extends React.Component<Props> {

  public static mapStateToProps(state: State): Partial<Props> {
    return {
      drawerOpen: state.app.drawerOpen,
      tabSelected: state.app.tabSelected,
      signedIn: state.app.signedIn,
      compendium: state.app.compendium,
      compendiumLoading: state.app.compendiumLoading,
    };
  }

  public static mapDispatchToProps(dispatch: Dispatch): Partial<Props> {
    return { dispatch };
  }

  private updateSigninStatus = (isSignedIn: boolean) => {
    if (isSignedIn) {
      this.props.dispatch({type: 'SIGNED_IN'});
    } else {
      this.props.dispatch({type: 'SIGNED_OUT'});
    }
  }

	private handleAuthClick = (event: any) => {
    gapi.auth2.getAuthInstance().signIn();
  }

	private handleSignoutClick = (event: any) => {
    gapi.auth2.getAuthInstance().signOut();
  }

  private loadDriveApi = () => {
    const script = document.createElement("script");
    script.src = "https://apis.google.com/js/client.js";

    script.onload = () => {
			gapi = window['gapi'];
			gapi.load('client:auth2', () => {
	      gapi.client.init({
	          apiKey: API_KEY,
	          clientId: CLIENT_ID,
	          discoveryDocs: DISCOVERY_DOCS,
	          scope: SCOPES
	        }).then(() => {
	        // Listen for sign-in state changes.
	        gapi.auth2.getAuthInstance().isSignedIn.listen(this.updateSigninStatus);
	        // Handle the initial sign-in state.
	        this.updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
	      });
			});
    };

    document.body.appendChild(script);
  }

  public componentDidMount() {
    this.loadDriveApi();
  }

  private toggleDrawer = (open: boolean) => {
  	return (event: React.MouseEvent<HTMLButtonElement>) => {
      if (open) {
        this.props.dispatch({type: 'OPEN_DRAWER'});
      } else {
        this.props.dispatch({type: 'CLOSE_DRAWER'});
      }
	  };
  }

  private selectTab = (event: React.MouseEvent<HTMLButtonElement>) => {
    const selectedTab = parseInt(event.currentTarget.dataset.tabindex || '0');
    this.props.dispatch({type: 'SELECT_TAB', value: selectedTab});
  }

  private handleTabChange = (event: React.ChangeEvent<{}>, value: number) => {
    this.props.dispatch({type: 'SELECT_TAB', value: value});
  }

  public render() {
    return <div style={{height: '100%'}} className="column">
	    <AppBar position="static">
        <Toolbar>
          <IconButton color="inherit" aria-label="Menu" onClick={this.toggleDrawer(true)}>
            <MenuIcon />
          </IconButton>
          {!this.props.signedIn && <Button onClick={this.handleAuthClick}>Sign In</Button>}
          {this.props.compendiumLoading && <CircularProgress color="secondary" />}
        </Toolbar>
        <Tabs value={this.props.tabSelected} onChange={this.handleTabChange}>
          <Tab label="Characters" />
          <Tab label="Spells" />
          <Tab label="Items" />
          <Tab label="Monsters" />
          <Tab label="Backgrounds" />
          <Tab label="Feats" />
          <Tab label="Classes" />
          <Tab label="Races" />
          <Tab label="Encounter" />
        </Tabs>
      </AppBar>
      <SwipeableDrawer open={this.props.drawerOpen} onClose={this.toggleDrawer(false)} onOpen={this.toggleDrawer(true)}>
        <Button data-tabindex="0" onClick={this.selectTab} style={{fontSize: '20px', textAlign: 'left'}}>Characters</Button>
        <Button data-tabindex="1" onClick={this.selectTab} style={{fontSize: '20px', textAlign: 'left'}}>Spells</Button>
        <Button data-tabindex="2" onClick={this.selectTab} style={{fontSize: '20px', textAlign: 'left'}}>Items</Button>
        <Button data-tabindex="3" onClick={this.selectTab} style={{fontSize: '20px', textAlign: 'left'}}>Monsters</Button>
        <Button data-tabindex="4" onClick={this.selectTab} style={{fontSize: '20px', textAlign: 'left'}}>Backgrounds</Button>
        <Button data-tabindex="5" onClick={this.selectTab} style={{fontSize: '20px', textAlign: 'left'}}>Feats</Button>
        <Button data-tabindex="6" onClick={this.selectTab} style={{fontSize: '20px', textAlign: 'left'}}>Classes</Button>
        <Button data-tabindex="7" onClick={this.selectTab} style={{fontSize: '20px', textAlign: 'left'}}>Races</Button>
        <Button data-tabindex="8" onClick={this.selectTab} style={{fontSize: '20px', textAlign: 'left'}}>Encounter</Button>
        {this.props.signedIn && <Button onClick={this.handleSignoutClick}>Sign Out</Button>}
      </SwipeableDrawer>
    	<div className="container">
	      {this.props.tabSelected === 0 && <CharactersTab />}
        {this.props.tabSelected === 1 && <SpellsTab />}
	      {this.props.tabSelected === 2 && <ItemsTab />}
        {this.props.tabSelected === 3 && <MonstersTab />}
        {this.props.tabSelected === 4 && <BackgroundsTab />}
        {this.props.tabSelected === 5 && <FeatsTab />}
        {this.props.tabSelected === 6 && <ClassesTab />}
        {this.props.tabSelected === 7 && <RacesTab />}
        {this.props.tabSelected === 8 && <EncounterTab />}
	    </div>
    </div>;
  }
}

export default connect(App.mapStateToProps, App.mapDispatchToProps)(App);