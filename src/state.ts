import * as React from 'react';
import Rules from './rules';

interface Attack {
  name: string;
  bonus: number | string;
  damage_type: string;
}

export default class State {
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
  new_attack_damage_type: string = '';
  attacks: Attack[] = [];

  private setState: (newState: any) => void;

  public constructor(setState: (newState: any) => void) {
  	this.setState = setState;
    Rules.attributes.forEach((attr) => {
      this[attr] = '';
      this[`${attr}_saving_throw_proficiency`] = false;
    });
    Object.keys(Rules.skills).forEach((skill) => {
      this[`${skill}_proficiency}`] = false;
    });
    Rules.coinage.forEach((coin) => {
      this[coin] = '';
    });
  	Object.entries(JSON.parse(window.localStorage.getItem('state') || '{}')).forEach(([key, value]) => {
  		this[key] = value;
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
      this[name] = isNaN(parseInt(value)) ? value: parseInt(value);
    }
  	window.localStorage.setItem('state', JSON.stringify(this));
  	this.setState(this);
  }

  public handleTextAreaChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
  	const name = event.currentTarget.name;
  	const value = event.currentTarget.value;
  	this[name] = value;
  	window.localStorage.setItem('state', JSON.stringify(this));
  	this.setState(this);
  }

  public handleButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
  	const name = event.currentTarget.name;
    if (name === 'add_attack') {
      this.attacks.push({
        name: this.new_attack_name,
        bonus: this.new_attack_bonus,
        damage_type: this.new_attack_damage_type,
      });
      this.new_attack_name = '';
      this.new_attack_bonus = '';
      this.new_attack_damage_type = '';
      window.localStorage.setItem('state', JSON.stringify(this));
      this.setState(this);
    } else if (name === 'remove_attack') {
      this.attacks.splice(parseInt(event.currentTarget.dataset.index as string), 1);
      window.localStorage.setItem('state', JSON.stringify(this));
      this.setState(this);
    }
  }
}