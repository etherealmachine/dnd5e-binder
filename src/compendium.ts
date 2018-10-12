import localForage from 'localforage';
import { parseString } from 'xml2js';
import store from './store';

export class Compendium {

  private static processedFiles: LocalForage = localForage.createInstance({
    name: 'processedFiles',
  });

  public static backgrounds: LocalForage = localForage.createInstance({name: 'backgrounds'});
  public static classes: LocalForage = localForage.createInstance({name: 'classes'});
  public static feats: LocalForage = localForage.createInstance({name: 'feats'});
  public static items: LocalForage = localForage.createInstance({name: 'items'});
  public static monsters: LocalForage = localForage.createInstance({name: 'monsters'});
  public static races: LocalForage = localForage.createInstance({name: 'races'});
  public static spells: LocalForage = localForage.createInstance({name: 'spells'});

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

  public static reloadFiles = () => {
    Compendium.processedFiles.clear();
    for (let namespace of Object.values(Compendium.types)) {
      Compendium[namespace].clear();
    }
    gapi.client.drive.files.list({
    	'q': "name contains '.xml'",
      'fields': "files(id, name)"
    }).then((response: any) => {
      const files = response.result.files;
      if (files && files.length > 0) {
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          Compendium.processedFiles.setItem(file.name, false);
          window.setTimeout(() => Compendium.getFile(file, i === files.length-1), i*1000);
        }
      }
    });
    store.dispatch({
      type: 'COMPENDIUM_LOADING_STARTED',
    });
  }

  private static getFile = (file: any, finished: boolean) => {
  	gapi.client.drive.files.get({
  		fileId: file.id,
  		alt: 'media',
  	}).then((response: any) => {
  		parseString(response.body, (err: any, result: any) => {
  			if (err) {
  				console.error(err);
  			} else {
  				Compendium.handleXMLFileRead(file.name, result);
  			}
  			if (finished) {
          store.dispatch({
            type: 'COMPENDIUM_LOADING_FINISHED',
          });
  			}
  		});
  	}, (error: any) => {
  		console.error(error)
  	});
  }

  private static handleXMLFileRead = (fileName: string, result: any) => {
  	if (result.hasOwnProperty('compendium')) {
      for (let [objectType, namespace] of Object.entries(Compendium.types)) {
        if (result.compendium.hasOwnProperty(objectType)) {
          for (let object of result.compendium[objectType]) {
            Compendium[namespace].setItem(object.name.toString(), object);
          }
        }
      }
      Compendium.processedFiles.setItem(fileName, true);
	  }
  }
}

export default Compendium;