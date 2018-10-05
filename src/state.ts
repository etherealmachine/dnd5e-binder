import * as React from 'react';

export default class State {
	character_name?: string = '';
  class?: string = '';
  level?: number = undefined;
  race?: string = '';
  background?: string = '';
  alignment?: string = '';
  player_name?: string = '';
  experience_points?: number = undefined;
  attributes: { [key: string]: number; } = {};
  proficiency_bonus?: number = undefined;
  proficiencies: string[] = [];
  maximum_hit_points?: number = undefined;
  current_hit_points?: number = undefined;
  temporary_hit_points?: number = undefined;
  special_abilities?: string = '';
  equipment?: string = '';
  languages?: string = '';
  expertise?: string = '';
  armor_class?: number = undefined;
  initiative_bonus?: number = undefined;
  speed?: number = undefined;
  passive_perception?: number = undefined;
  personality_traits: string = '';
  ideals: string = '';
  bonds: string = '';
  flaws: string = '';
  features_and_traits: string = '';

  private setState: (newState: any) => void;

  public constructor(setState: (newState: any) => void) {
  	this.setState = setState;
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