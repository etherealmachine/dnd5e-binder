import * as React from 'react';
import Compendium from './compendium';
import localForage from 'localforage';

interface Attack {
  name: string;
  bonus: number | string;
  damage: string;
}

class Model {
	public id: string;
	public namespace: string;
  public compendium: Compendium = new Compendium(() => {});
	protected localforage: LocalForage;
  protected setState: (newState: any) => void;

  public constructor(id: string, namespace: string, setState: (newState: any) => void) {
  	this.id = id;
  	this.localforage = localForage.createInstance({name: namespace});
  	this.setState = setState;
    this.localforage.getItem(this.id).then((item: { [key: string]: any }) => {
    	if (item) {
	    	Object.entries(item).forEach(([key, value]) => {
	    		this[key] = value;
	    	});
	    }
    });
  }

  protected handleChange() {
		const obj = JSON.parse(JSON.stringify(this));
		delete obj.namespace;
		delete obj.compendium;
		delete obj.localforage;
		delete obj.setState;
		this.localforage.setItem(this.id, obj);
  	this.setState(this);
  }
}

export class Character extends Model {
  character_name: string = '';
  class: string = '';
  level: number | string = '';
  race: string = '';
  background: string = '';
  alignment: string = '';
  player_name: string = '';
  experience_points: number | string = '';
  proficiency_bonus: number | string = '';
  maximum_hit_points: number | string = '';
  current_hit_points: number | string = '';
  temporary_hit_points: number | string = '';
  special_abilities: string = '';
  equipment: string = '';
  proficiencies: string = '';
  languages: string = '';
  expertise: string = '';
  armor_class: number | string = '';
  initiative_bonus: number | string = '';
  speed: number | string = '';
  passive_perception: number | string = '';
  personality_traits: string = '';
  ideals: string = '';
  bonds: string = '';
  flaws: string = '';
  features_and_traits: string = '';
  new_attack_name: string = '';
  new_attack_bonus: number | string = '';
  new_attack_damage: string = '';
  attacks: Attack[] = [];

  public constructor(id: string, setState: (newState: any) => void) {
  	super(id, 'characters', setState);
    this.compendium.attributes.forEach((attr) => {
      this[attr] = '';
      this[`${attr}_saving_throw_proficiency`] = false;
    });
    Object.keys(this.compendium.skills).forEach((skill) => {
      this[`${skill}_proficiency`] = false;
    });
    this.compendium.coinage.forEach((coin) => {
      this[coin] = '';
    });
  }

  public handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const target = event.currentTarget;
  	const {name, value} = target;
    if (this[name] instanceof Array) {
      const {index, key} = target.dataset;
      this[name][parseInt(index as string)][key] = value;
    } else if (target.type === 'checkbox') {
      this[name] = target.checked;
    } else {
      this[name] = isNaN(Number(value)) ? value: parseInt(value);
    }
    this.handleChange();
  }

  public handleTextAreaChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
  	const name = event.currentTarget.name;
  	const value = event.currentTarget.value;
  	this[name] = value;
    this.handleChange();
  }

  public handleButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
  	const name = event.currentTarget.name;
    if (name === 'add_attack') {
      this.attacks.push({
        name: this.new_attack_name,
        bonus: this.new_attack_bonus,
        damage: this.new_attack_damage,
      });
      this.new_attack_name = '';
      this.new_attack_bonus = '';
      this.new_attack_damage = '';
	    this.handleChange();
    } else if (name === 'remove_attack') {
      this.attacks.splice(parseInt(event.currentTarget.dataset.index as string), 1);
	    this.handleChange();
    }
  }
}