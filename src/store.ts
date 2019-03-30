import { combineReducers, createStore } from 'redux';

import Compendium from './compendium';
import { Race, Class, Feat, Spell, Item } from './compendium';
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

export interface CharacterState {
    player_name: string
    character_name: string
    race?: Race
    classes: Class[]
    feats: Feat[]
    spells: Spell[]
    items: Item[]
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
            player_name: '',
            character_name: '',
            classes: [],
            feats: [],
            spells: [],
            items: [],
        };
    }
    switch (action.type) {
        case 'FIELD_CHANGE':
            return { ...state, [action.key]: action.value };
        case 'SET_RACE':
            return {
                ...state,
                race: action.race,
            };
        case 'ADD_CLASS':
            return {
                ...state,
                classes: [...state.classes, action.class],
            }
        case 'ADD_FEAT':
            return {
                ...state,
                feats: [...state.feats, action.feat],
            };
        case 'ADD_ITEM':
            return {
                ...state,
                items: [...state.items, action.item],
            };
        case 'ADD_SPELL':
            return {
                ...state,
                spells: [...state.spells, action.spell],
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
                newSelection = newCharacters.length - 1;
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
                selected: newCharacters.length - 1,
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
            monsters: []
        };
    }
    switch (action.type) {
        case 'ADD_TO_ENCOUNTER':
            let newMonsters = state.monsters.slice();
            let newMonster = Object.assign({}, action.monster);
            let i = 0;
            if (newMonster.id === '') {
                newMonster.id = `Unnamed ${action.monster.name}`;
                while (newMonsters.some((monster: any) => monster.id === newMonster.id)) {
                    i++;
                    newMonster.id = `Unnamed ${action.monster.name} ${i}`;
                }
            }
            if (action.monster.hp !== undefined) {
                newMonster.currentHP = (typeof (action.monster.hp) === 'string') ? parseInt(action.monster.hp.split(' ')[0]) : action.monster.hp;
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
        case 'UPDATE_MONSTER':
            newMonsters = state.monsters.slice();
            const newMonsterIndex = newMonsters.findIndex((monster: any) => monster.id === action.id);
            if (newMonsterIndex < 0) {
                return { monsters: newMonsters };
            }
            newMonster = Object.assign(newMonsters[newMonsterIndex], action.newValues);
            newMonsters[newMonsterIndex] = newMonster;
            return {
                monsters: newMonsters,
            };
    }
    return state;
}

export const store = createStore(combineReducers({ app, characters, encounter }), JSON.parse(window.localStorage.getItem('state') || '{}'), window['__REDUX_DEVTOOLS_EXTENSION__'] && window['__REDUX_DEVTOOLS_EXTENSION__']());

store.subscribe(() => { window.localStorage.setItem('state', JSON.stringify(store.getState())) });

// Create a Redux store holding the state of your app.
// Its API is { subscribe, dispatch, getState }.
export default store;