import * as React from 'react';
import Rules from './rules';

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
  proficiencies: string[] = [];
  maximum_hit_points: number | string = '';
  current_hit_points: number | string = '';
  temporary_hit_points: number | string = '';
  special_abilities: string = '';
  equipment: string = '';
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
  	const name = event.currentTarget.name;
    if (event.currentTarget.type === 'checkbox') {
      this[name] = event.currentTarget.checked;
    } else {
      this[name] = isNaN(parseInt(event.currentTarget.value)) ? event.currentTarget.value: parseInt(event.currentTarget.value);
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
  	console.log(name);
  }
}