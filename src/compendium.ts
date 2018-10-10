import localForage from 'localforage';
import { parseString } from 'xml2js';

export class Compendium {

  private processedFiles: LocalForage = localForage.createInstance({
    name: 'processedFiles',
  });
  private setState: (newState: any) => void;

  public loading: boolean = false;
  public backgrounds: LocalForage = localForage.createInstance({name: 'backgrounds'});
  public classes: LocalForage = localForage.createInstance({name: 'classes'});
  public feats: LocalForage = localForage.createInstance({name: 'feats'});
  public items: LocalForage = localForage.createInstance({name: 'items'});
  public monsters: LocalForage = localForage.createInstance({name: 'monsters'});
  public races: LocalForage = localForage.createInstance({name: 'races'});
  public spells: LocalForage = localForage.createInstance({name: 'spells'});

  public attributes = [
	  "Strength",
	  "Dexterity",
	  "Constitution",
	  "Intelligence",
	  "Wisdom",
	  "Charisma"
	];

	public skills = {
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

	public coinage = [
	  "Copper",
	  "Silver",
	  "Electrum",
	  "Gold",
	  "Platinum"
	];

	public hit_dice_for_class = {
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

  public constructor(setState: (newState: any) => void) {
  	this.setState = setState;
  }

  public reloadFiles = () => {
    this.processedFiles.clear();
    for (let objectType of ['background',  'class', 'feat', 'item', 'monster', 'race', 'spell']) {
      this[objectType + 's'].clear();
    }
    gapi.client.drive.files.list({
    	'q': "name contains '.xml'",
      'fields': "files(id, name)"
    }).then((response: any) => {
      const files = response.result.files;
      if (files && files.length > 0) {
      	this.setState({
      		compendium: this,
      	});
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          this.processedFiles.setItem(file.name, false);
          window.setTimeout(() => this.getFile(file, i === files.length-1), i*1000);
        }
      }
    });
    this.setState({
      drawerOpen: false,
    });
  }

  private getFile = (file: any, finished: boolean) => {
  	gapi.client.drive.files.get({
  		fileId: file.id,
  		alt: 'media',
  	}).then((response: any) => {
  		parseString(response.body, (err: any, result: any) => {
  			if (err) {
  				console.error(err);
  			} else {
  				this.handleXMLFileRead(file.name, result);
  			}
  			if (finished) {
  				this.setState({
	      		compendium: this,
  				});
  			}
  		});
  	}, (error: any) => {
  		console.error(error)
  	});
  }

  private handleXMLFileRead = (fileName: string, result: any) => {
  	if (result.hasOwnProperty('compendium')) {
      for (let objectType of ['background',  'class', 'feat', 'item', 'monster', 'race', 'spell']) {
        if (result.compendium.hasOwnProperty(objectType)) {
          for (let object of result.compendium[objectType]) {
            this[objectType + 's'].setItem(object.name.toString(), object);
          }
        }
      }
      this.processedFiles.setItem(fileName, true);
	  }
  }
}

export default Compendium;