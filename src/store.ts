import { combineReducers, createStore } from 'redux'

import Compendium from './compendium';

export interface State {
  app: AppState
  compendium: CompendiumState
  character: CharacterState
}

interface AppState {
  drawerOpen: boolean
  tabSelected: number
  signedIn: boolean
}

interface CompendiumState {
  compendium: Compendium
}

interface Attack {
  name: string;
  bonus: number | string;
  damage: string;
}

interface CharacterState {
  character_name: string
  class: string
  level: number | string
  race: string
  background: string
  alignment: string
  player_name: string
  experience_points: number | string
  proficiency_bonus: number | string
  maximum_hit_points: number | string
  current_hit_points: number | string
  temporary_hit_points: number | string
  special_abilities: string
  equipment: string
  proficiencies: string
  languages: string
  expertise: string
  armor_class: number | string
  initiative_bonus: number | string
  speed: number | string
  passive_perception: number | string
  personality_traits: string
  ideals: string
  bonds: string
  flaws: string
  features_and_traits: string
  new_attack_name: string
  new_attack_bonus: number | string
  new_attack_damage: string
  attacks: Attack[]
}

function app(state: AppState, action: any): AppState {
  if (state === undefined) {
    return {
      drawerOpen: false,
      tabSelected: 0,
      signedIn: false,
    };
  }
  const newState: AppState = Object.assign({}, state);
  switch (action.type) {
    case 'OPEN_DRAWER':
      newState.drawerOpen = true;
      break;
    case 'CLOSE_DRAWER':
      newState.drawerOpen = false;
      break;
    case 'SELECT_TAB':
      newState.tabSelected = action.value;
      newState.drawerOpen = false;
      break;
    case 'SIGNED_IN':
      newState.signedIn = true;
      break;
    case 'SIGNED_OUT':
      newState.signedIn = false;
      break;
  }
  return newState;
}

function compendium(state: CompendiumState, action: any): CompendiumState {
  if (state === undefined) {
    return {
      compendium: new Compendium(() => {}),
    }
  }
  const newState: CompendiumState = Object.assign({}, state);
  return newState;
}

function character(state: CharacterState, action: any): CharacterState {
  const newState: CharacterState = Object.assign({}, state);
  return newState;
}

export const store = createStore(combineReducers({app, compendium, character}));
​
// Create a Redux store holding the state of your app.
// Its API is { subscribe, dispatch, getState }.
export default store;