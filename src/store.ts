import { combineReducers, createStore } from 'redux'

import Compendium from './compendium';

export interface State {
  app: AppState
  character: CharacterState
  characters: CharacterState[]
}

export interface AppState {
  drawerOpen: boolean
  tabSelected: number
  signedIn: boolean
  compendiumLoading: boolean
}

export interface Attack {
  name: string;
  bonus: number;
  damage: string;
}

export interface CharacterState {
  character_name: string
  attributes: { [key: string]: number | undefined }
  saving_throw_proficiency: { [key: string]: boolean }
  skill_proficiency: { [key: string]: boolean }
  class: string
  level?: number
  race: string
  background: string
  alignment: string
  player_name: string
  experience_points?: number
  proficiency_bonus?: number
  maximum_hit_points?: number
  current_hit_points?: number
  current_hit_dice?: number
  temporary_hit_points?: number
  special_abilities: string
  equipment: string
  coinage: { [key: string]: number | undefined }
  proficiencies: string
  languages: string
  expertise: string
  armor_class?: number
  initiative_bonus?: number
  speed?: number
  passive_perception?: number
  personality_traits: string
  ideals: string
  bonds: string
  flaws: string
  features_and_traits: string
  attacks: Attack[]
}

function app(state: AppState, action: any): AppState {
  if (state === undefined) {
    return {
      drawerOpen: false,
      tabSelected: 3,
      signedIn: false,
      compendiumLoading: false,
    };
  }
  switch (action.type) {
    case 'OPEN_DRAWER':
      return { ...state, drawerOpen: true };
    case 'CLOSE_DRAWER':
      return { ...state, drawerOpen: false };
      break;
    case 'SELECT_TAB':
      return {
        ...state,
        tabSelected: action.value,
        drawerOpen: false,
      };
    case 'SIGNED_IN':
      return { ...state, signedIn: true };
    case 'SIGNED_OUT':
      return { ...state, signedIn: false };
    case 'COMPENDIUM_LOADING_STARTED':
      return { ...state, compendiumLoading: true, drawerOpen: false };
    case 'COMPENDIUM_LOADING_FINISHED':
      return { ...state, compendiumLoading: false };
  }
  return state;
}

function character(state: CharacterState, action: any): CharacterState {
  if (state === undefined) {
    return {
      character_name: '',
      attributes: Compendium.attributes.reduce((obj, attr) => { obj[attr] = undefined; return obj }, {}),
      saving_throw_proficiency: Compendium.attributes.reduce((obj, attr) => { obj[attr] = false; return obj }, {}),
      skill_proficiency: Object.entries(Compendium.skills).reduce((obj, [skill, attr]) => { obj[skill] = false; return obj }, {}),
      class: '',
      level: undefined,
      race: '',
      background: '',
      alignment: '',
      player_name: '',
      experience_points: undefined,
      proficiency_bonus: undefined,
      maximum_hit_points: undefined,
      current_hit_points: undefined,
      current_hit_dice: undefined,
      temporary_hit_points: undefined,
      special_abilities: '',
      coinage: {},
      equipment: '',
      proficiencies: '',
      languages: '',
      expertise: '',
      armor_class: undefined,
      initiative_bonus: undefined,
      speed: undefined,
      passive_perception: undefined,
      personality_traits: '',
      ideals: '',
      bonds: '',
      flaws: '',
      features_and_traits: '',
      attacks: [],
    };
  }
  switch (action.type) {
    case 'FIELD_CHANGE':
      return { ...state, [action.key]: isNaN(action.value)? undefined : action.value };
    case 'ATTRIBUTE_CHANGE':
      return {
        ...state,
        attributes: {
          ...state.attributes,
          [action.key]: isNaN(action.value)? undefined : action.value,
        }
      };
    case 'SAVING_THROW_PROFICIENCY_CHANGE':
      return {
        ...state,
        saving_throw_proficiency: {
          ...state.saving_throw_proficiency,
          [action.key]: action.value,
        }
      };
    case 'SKILL_PROFICIENCY_CHANGE':
      return {
        ...state,
        skill_proficiency: {
          ...state.skill_proficiency,
          [action.key]: action.value,
        }
      };
    case 'COINAGE_CHANGE':
      return {
        ...state,
        coinage: {
          ...state.coinage,
          [action.key]: isNaN(action.value)? undefined : action.value,
        }
      };
    case 'ADD_ATTACK':
      let newAttacks = state.attacks.slice();
      newAttacks.push({
        name: action.name,
        bonus: action.bonus,
        damage: action.damage,
      });
      return {
        ...state,
        attacks: newAttacks,
      };
    case 'REMOVE_ATTACK':
      newAttacks = state.attacks.slice();
      newAttacks.splice(action.index, 1);
      return {
        ...state,
        attacks: newAttacks,
      };
  }
  return state;
}

function characters(state: CharacterState[], action: any): CharacterState[] {
  const newState: CharacterState[] = Object.assign({}, state);
  return newState;
}

export const store = createStore(combineReducers({app, character, characters}));
​
// Create a Redux store holding the state of your app.
// Its API is { subscribe, dispatch, getState }.
export default store;