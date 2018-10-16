import store from './store';

export interface KeyValuePair {
  name: string
  text: string
}

export type KeyValuePairList = KeyValuePair | KeyValuePair[] | undefined;

export function MapPairs(pairs: KeyValuePairList, callback: (pair: KeyValuePair, index: number) => any): any[] | undefined{
  if (pairs === undefined) {
    return undefined;
  } else if ((<KeyValuePair>pairs).hasOwnProperty('name')) {
    return [callback(<KeyValuePair>pairs, 0)];
  } else {
    return Object.values(<KeyValuePair[]>pairs).map(callback);
  }
}

export interface Background {

}

export interface Class {

}

export interface Feat {

}

export interface Item {
  ac?: string
  dmg1?: string
  dmg2?: string
  dmgType?:string
  magic?: string
  modifier?: string[]
  name?: string
  property?: string
  range?: string
  rarity?: string
  roll?: string
  stealth?: string
  strength?: string
  text?: string[]
  type?: string
  value?: string
  weight?: number
}

export interface Monster {
  ac?: string
  action?: KeyValuePairList
  alignment?: string
  cha?: number
  con?: number
  conditionImmune?: string
  cr?: number
  description?: string
  dex?: number
  hp?: string
  immune?: string
  int?: number
  languages?: string
  legendary?: KeyValuePairList
  name?: string
  passive?: number
  reaction?: KeyValuePairList
  resist?: string
  save?: string
  senses?: string
  size?: string
  skill?: string
  slots?: string
  speed?: string
  spells?: string
  str?: number
  text?: string[]
  trait?: KeyValuePairList
  type?: string
  vulnerable?: string
  wis?: number
}

export interface Race {

}

export interface Spell {
  name?: string[]
}

export class Compendium {

  public static backgrounds: { [key: string]: Background } = {}
  public static classes: { [key: string]: Class } = {}
  public static feats: { [key: string]: Feat } = {}
  public static items: { [key: string]: Item } = {}
  public static monsters: { [key: string]: Monster } = {}
  public static races: { [key: string]: Race } = {}
  public static spells: { [key: string]: Spell } = {}

  public static attributes = [
	  "Strength",
	  "Dexterity",
	  "Constitution",
	  "Intelligence",
	  "Wisdom",
	  "Charisma"
	];

	public static skills = {
	  "Acrobatics": "Dexterity",
	  "Animal Handling": "Wisdom",
	  "Arcana": "Intelligence",
	  "Athletics": "Strength",
	  "Deception": "Charisma",
	  "History": "Wisdom",
	  "Insight": "Wisdom",
	  "Intimidation": "Charisma",
	  "Investigation": "Intelligence",
	  "Medicine": "Wisdom",
	  "Nature": "Intelligence",
	  "Perception": "Wisdom",
	  "Performance": "Charisma",
	  "Persuasion": "Charisma",
	  "Religion": "Intelligence",
	  "Slight of Hand": "Dexterity",
	  "Stealth": "Dexterity",
	  "Survival": "Wisdom"
	};

	public static coinage = [
	  "Copper",
	  "Silver",
	  "Electrum",
	  "Gold",
	  "Platinum"
	];

	public static hit_dice_for_class = {
		"Barbarian": 12,
		"Bard": 8,
		"Cleric": 8,
		"Druid": 8,
		"Fighter": 10,
		"Monk": 8,
		"Paladin": 10,
		"Ranger": 10,
		"Rogue": 8,
		"Sorcerer": 6,
		"Warlock": 8,
		"Wizard": 6
	}

  public static types = {
    'background': 'backgrounds',
    'class': 'classes',
    'feat': 'feats',
    'item': 'items',
    'monster': 'monsters',
    'race': 'races',
    'spell': 'spells',
  }

  public static sources = [
    'Artificer UA.json',
    'Backgrounds 1.6.0.json',
    'Bestiary Compendium 2.1.0.json',
    'Character Compendium 3.1.0.json',
    'Classes 3.1.1.json',
    'Curse of Strahd Bestiary 1.2.0.json',
    'EE Spells 2.6.json',
    'Feats 1.4.1.json',
    'Futuristic Items 1.2.json',
    'Hoard of the Dragon Queen Bestiary 1.3.0.json',
    'Items Compendium 1.7.0.json',
    'Magic Items 5.3.json',
    'Modern Items 1.2.json',
    'Modern Spells 1.1.json',
    'Monster Manual Bestiary 2.6.0.json',
    'Mundane Items 2.8.0.json',
    'Out of the Abyss 1.4.0.json',
    'PHB Spells 3.9.0.json',
    'Phandelver Bestiary 1.3.0.json',
    'Princes of the Apocalypse Bestiary 1.3.0.json',
    'Races 2.0.json',
    'Renaissance Items 1.3.json',
    'SCAG Spells 1.2.json',
    'Spells Compendium 1.3.0.json',
    'Storm King_s Thunder Bestiary 1.1.0.json',
    'The Rise of Tiamat Bestiary 1.3.0.json',
    'UA_Demon Summoning 1.0.json',
    'UA_Races 1.0.1.json',
    'Valuable Items 1.3.json',
    'Volo_s Bestiary 1.1.0.json',
  ]

  private static fileCount: number = 0;

  private static loadFile(filename: string, resp: any): void {
    Object.entries(Compendium.types).forEach(([objType, attrName]) => {
      if (resp.hasOwnProperty(objType)) {
        Object.values(resp[objType]).forEach((obj: any) => {
          Compendium[attrName][obj.name] = obj;
        });
      }
    });
    Compendium.fileCount--;
    if (Compendium.fileCount === 0) {
      store.dispatch({
        type: 'COMPENDIUM_LOADING_FINISHED',
      });
      window['compendium'] = this;
    }
  }


  public static loadFiles(): void {
    Compendium.sources.forEach((filename) => {
      Compendium.fileCount++;
      const xhr = new XMLHttpRequest();
      xhr.open('GET', `data/${filename}`, true);
      xhr.responseType = 'json';
      xhr.onload = () => {
        var status = xhr.status;
        if (status === 200) {
          this.loadFile(filename, xhr.response);
        } else {
          console.error(status, xhr.response);
        }
      };
      xhr.send();
    });
  }

}

export default Compendium;