import store from './store';

export interface NameTextPair {
  name: string
  text: string
}

export interface Monster {
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
  currentHP?: number
  initiative?: number
}

export interface Spell {
  name: string
  level: number
  classes: string
  time: string
  duration: string
  range: string
  components: string
  school: string
  text: string[] | string
}

export interface Item {
  name: string
  range: string
  dmg1: string
  dmg2: string
  dmgType: string
  value: string
  ac: string
  text: string[] | string
}

export class Compendium {

  public backgrounds: { [key: string]: any } = {}
  public classes: { [key: string]: any } = {}
  public feats: { [key: string]: any } = {}
  public items: { [key: string]: any } = {}
  public monsters: { [key: string]: any } = {}
  public races: { [key: string]: any } = {}
  public spells: { [key: string]: any } = {}

  public static abilities = [
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

  public static modifier(ability_score: number | string | undefined) {
    if (ability_score === undefined) {
      return NaN;
    }
    if (typeof(ability_score) === 'string') {
      ability_score = parseInt(ability_score);
    }
    return Math.floor((ability_score - 10) / 2);
  }

  public static modifierText(bonus: number) {
    if (isNaN(bonus)) {
      return '';
    }
    if (bonus < 0) {
      return bonus;
    }
    return '+' + bonus;
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

  public static cr_to_xp = {
    '0': 10,
    '1/8': 25,
    '1/4': 50,
    '1/2': 100,
    '1': 200,
    '2': 450,
    '3': 700,
    '4': 1100,
    '5': 1800,
    '6': 2300,
    '7': 2900,
    '8': 3900,
    '9': 5000,
    '10': 5900,
    '11': 7200,
    '12': 8400,
    '13': 10000,
    '14': 11500,
    '15': 13000,
    '16': 15000,
    '17': 18000,
    '18': 20000,
    '19': 22000,
    '20': 25000,
    '21': 33000,
    '22': 41000,
    '23': 50000,
    '24': 62000,
    '25': 75000,
    '26': 90000,
    '27': 105000,
    '28': 120000,
    '29': 135000,
    '30': 155000,
  }

  public constructor() {
    this.loadFiles();
  }

  private fileCount: number = 0;

  private loadFile(filename: string, resp: any): void {
    Object.entries(Compendium.types).forEach(([objType, attrName]) => {
      if (resp.hasOwnProperty(objType)) {
        Object.values(resp[objType]).forEach((obj: any) => {
          if (obj.name) {
            obj['source'] = filename;
            this[attrName][obj.name] = obj;
          }
        });
      }
    });
    this.fileCount--;
    if (this.fileCount === 0) {
      store.dispatch({
        type: 'COMPENDIUM_LOADING_FINISHED',
      });
    }
  }

  private loadFiles(): void {
    Compendium.sources.forEach((filename) => {
      this.fileCount++;
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