import { combineReducers, createStore } from 'redux';

import Compendium from './compendium';
import { appInstance } from './App';

export interface State {
  app: AppState
  characters: CharactersState
  encounter: EncounterState
}

export interface AppState {
  drawerOpen: boolean
  tabSelected: number
  signedIn: boolean
  compendium: Compendium
  compendiumLoading: boolean
}

export interface CharactersState {
  selected: number
  characters: CharacterState[]
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

export interface EncounterState {
  monsters: any[]
}

function app(state: AppState | undefined, action: any): AppState {
  if (state === undefined) {
    return {
      drawerOpen: false,
      tabSelected: 0,
      signedIn: false,
      compendium: new Compendium(),
      compendiumLoading: true,
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
    case 'COMPENDIUM_LOADING_FINISHED':
      window['Compendium'] = state.compendium;
      return { ...state, compendiumLoading: false };
  }
  return state;
}

function character(state: CharacterState | undefined, action: any): CharacterState {
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
      return { ...state, [action.key]: action.value };
    case 'ATTRIBUTE_CHANGE':
      return {
        ...state,
        attributes: {
          ...state.attributes,
          [action.key]: action.value,
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
          [action.key]: action.value,
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

function characters(state: CharactersState | undefined, action: any): CharactersState {
  if (state === undefined) {
    return {
      selected: 0,
      characters: [
        character(undefined, undefined),
      ],
    };
  }
  switch (action.type) {
    case 'SELECT_CHARACTER':
      if (action.value >= state.characters.length) {
        const newCharacters = state.characters.slice();
        newCharacters.push(character(undefined, undefined));
        return {
          selected: action.value,
          characters: newCharacters,
        };
      }
      return {
        ...state,
        selected: action.value,
      };
    case 'DELETE_CHARACTER':
      let newCharacters = state.characters.slice();
      newCharacters.splice(state.selected, 1);
      if (newCharacters.length === 0) {
        newCharacters.push(character(undefined, undefined));
      }
      let newSelection = state.selected;
      if (newSelection >= newCharacters.length) {
        newSelection = newCharacters.length-1;
      }
      return {
        ...state,
        selected: newSelection,
        characters: newCharacters,
      };
    case 'IMPORT_CHARACTER':
      newCharacters = state.characters.slice();
      newCharacters.push(action.value);
      return {
        ...state,
        selected: newCharacters.length-1,
        characters: newCharacters,
      };
  }
  const selectedCharacter = Object.assign({}, state.characters[state.selected]);
  const newCharacters = state.characters.slice();
  newCharacters[state.selected] = character(selectedCharacter, action);
  return {
    ...state,
    characters: newCharacters,
  };
}

function encounter(state: EncounterState | undefined, action: any): EncounterState {
  if (state === undefined) {
    return {
      monsters: [],
    };
  }
  switch (action.type) {
    case 'ADD_TO_ENCOUNTER':
      let newMonsters = state.monsters.slice();
      let newMonster = Object.assign({}, action.monster);
      let i = 0;
      newMonster.id = `Unnamed ${action.monster.name}`;
      while (newMonsters.some((monster: any) => monster.id === newMonster.id)) {
        i++;
        newMonster.id = `Unnamed ${action.monster.name} ${i}`;
      }
      newMonsters.push(newMonster);
      if (appInstance !== null) {
        appInstance.addSnackbarMessage(`Added ${newMonster.id}`);
      }
      return {
        monsters: newMonsters,
      };
    case 'REMOVE_FROM_ENCOUNTER':
      newMonsters = state.monsters.slice();
      newMonsters.splice(newMonsters.findIndex((monster: any) => monster.id === action.monster.id), 1);
      return {
        monsters: newMonsters,
      };
    case 'UPDATE_ID':
      newMonsters = state.monsters.slice();
      newMonsters.find((monster: any) => monster.id === action.from).id = action.to;
      return {
        monsters: newMonsters,
      };
  }
  return state;
}

export const store = createStore(combineReducers({app, characters, encounter}), JSON.parse(window.localStorage.getItem('state') || '{}'), window['__REDUX_DEVTOOLS_EXTENSION__'] && window['__REDUX_DEVTOOLS_EXTENSION__']());

store.subscribe(() => { window.localStorage.setItem('state', JSON.stringify(store.getState())) });

// Create a Redux store holding the state of your app.
// Its API is { subscribe, dispatch, getState }.
export default store;