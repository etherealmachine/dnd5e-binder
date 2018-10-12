import "core-js/library";
import * as React from 'react';
import { Dispatch } from 'redux';

import './CharacterSheet.css';
import Compendium from './compendium';
import { CharacterState } from './store';
import NumberInput from './NumberInput';

export interface Props extends CharacterState {
  dispatch: Dispatch
}

interface State {
  new_attack_name: string
  new_attack_bonus: number | string
  new_attack_damage: string
}

class CharacterSheet extends React.Component<Props, State> {

  public constructor(props: Props) {
    super(props);
    this.state = {
      new_attack_name: '',
      new_attack_bonus: '',
      new_attack_damage: '',
    };
    this.handleFieldChange = this.handleInputChange('FIELD');
  }

  private attributeBonus(attr: string): number {
    if (this.props.attributes[attr] === undefined) {
      return NaN;
    }
    return Math.floor(((this.props.attributes[attr] as number)-10)/2);
  }

  private skillBonus(skill: string, attr: string): number {
    if (this.props.skill_proficiency[skill] && this.props.proficiency_bonus !== undefined) {
      return this.props.proficiency_bonus + this.attributeBonus(attr);
    }
    return this.attributeBonus(attr);
  }

  private savingThrowBonus(attr: string): number {
    if (this.props.saving_throw_proficiency[attr] && this.props.proficiency_bonus !== undefined) {
      return this.attributeBonus(attr) + this.props.proficiency_bonus;
    }
    return this.attributeBonus(attr);
  }

  private bonusText(bonus: number) {
    if (isNaN(bonus)) {
      return <span>&nbsp;&nbsp;</span>;
    }
    if (bonus < 0) {
      return <span>{bonus}</span>;
    }
    return <span>+{bonus}</span>;
  }

  private handleFieldChange: (event: React.ChangeEvent<HTMLInputElement>) => void;

  private handleInputChange = (type: string) => {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      const target = event.currentTarget;
      const {name, value} = target;
      if (target.type === 'checkbox') {
        this.props.dispatch({
          type: `${type}_CHANGE`,
          key: name,
          value: target.checked,
        });
      } else if (target.type === 'number') {
        this.props.dispatch({
          type: `${type}_CHANGE`,
          key: name,
          value: parseInt(value),
        });
      } else {
        this.props.dispatch({
          type: `${type}_CHANGE`,
          key: name,
          value: value,
        });
      }
    }
  }

  private handleStateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const target = event.currentTarget;
    const {name, value} = target;
    this.setState({
      ...this.state,
      [name]: value,
    });
  }

  private handleTextAreaChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const name = event.currentTarget.name;
    const value = event.currentTarget.value;
    this.props.dispatch({
      type: 'FIELD_CHANGE',
      key: name,
      value: value,
    });
  }

  private handleButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const name = event.currentTarget.name;
    if (name === 'add_attack') {
      this.props.dispatch({
        type: 'ADD_ATTACK',
        name: this.state.new_attack_name,
        bonus: this.state.new_attack_bonus,
        damage: this.state.new_attack_damage,
      });
      this.setState({
        new_attack_name: '',
        new_attack_bonus: '',
        new_attack_damage: '',
      });
    } else if (name === 'remove_attack') {
      const index: number = parseInt(event.currentTarget.dataset.index as string);
      this.props.dispatch({
        type: 'REMOVE_ATTACK',
        index: index,
      });
    }
  }

  public render() {
    const attributes: JSX.Element[] = [];
    const savingThrows: JSX.Element[] = [];
    Object.entries(this.props.attributes).forEach(([attr, value]) => {
      attributes.push(
        <div key={`${attr}-attr`} className="column align-items-center" style={{padding: '10px 0'}}>
          <span>{this.bonusText(this.attributeBonus(attr))}</span>
          <NumberInput name={attr} placeholder={attr.slice(0,3)} type="number" min="0" max="20" value={value} onChange={this.handleInputChange('ATTRIBUTE')} />
          <label>{attr}</label>
        </div>
      );
      savingThrows.push(
        <div key={`${attr}-saving-throw`} className="row align-items-center">
          <input name={attr} type="checkbox" checked={this.props.saving_throw_proficiency[attr]} onChange={this.handleInputChange('SAVING_THROW_PROFICIENCY')} />
          <span>{attr}</span>
          <span className="bonus">{this.bonusText(this.savingThrowBonus(attr))}</span>
        </div>
      );
    })
    const skills: JSX.Element[] = Object.entries(Compendium.skills).map(([skill, attr]) => {
      return <div key={skill} className="row align-items-center">
        <input name={skill} type="checkbox" checked={this.props.skill_proficiency[skill]} onChange={this.handleInputChange('SKILL_PROFICIENCY')} />
        <span>{skill}&nbsp;<span className="fc-gray-1">({attr})</span></span>
        <span className="bonus">{this.bonusText(this.skillBonus(skill, attr))}</span>
      </div>
    });
    const coins: JSX.Element[] = Compendium.coinage.map((coin) => {
      return <div key={coin} className="column align-items-center">
        <NumberInput name={coin} type="number" min="0" value={this.props.coinage[coin]} onChange={this.handleInputChange('COINAGE')} />
        <label className="flex-1" htmlFor={coin}>{coin}</label>
      </div>
    });
    const attacks = (
      <div className="column">
        {this.props.attacks.map((attack, i) => {
          return (<div key={`attack-${i}`} className="align-items-center">
            <input className="flat" name="attacks" data-index={i} data-key="name" value={this.props.attacks[i].name} onChange={this.handleFieldChange} />
            <NumberInput className="flat" name="attacks" type="number" min="0" data-index={i} data-key="bonus" value={this.props.attacks[i].bonus} onChange={this.handleFieldChange} />
            <input className="flat" name="attacks" data-index={i} data-key="damage"  value={this.props.attacks[i].damage} onChange={this.handleFieldChange} />
            <button name="remove_attack" data-index={i} onClick={this.handleButtonClick}>-</button>
          </div>);
        })}
        <div className="row align-items-center flex-wrap">
          <div className="column">
            <input className="flat" name="new_attack_name" type="text" value={this.state.new_attack_name} onChange={this.handleStateChange} />
            <span className="align-self-center">Name</span>
          </div>
          <div className="column">
            <NumberInput className="flat" name="new_attack_bonus" type="number" min="0" value={this.state.new_attack_bonus} onChange={this.handleStateChange} />
            <span className="align-self-center">Bonus</span>
          </div>
          <div className="column">
            <input className="flat" name="new_attack_damage" type="text" value={this.state.new_attack_damage} onChange={this.handleStateChange} />
            <span className="align-self-center">Damage</span>
          </div>
          <div className="column">
            <button name="add_attack" onClick={this.handleButtonClick}>+</button>
            <span>&nbsp;</span>
          </div>
        </div>
      </div>);
    return (
      <div>
        <div className="row flex-1 flex-wrap" style={{marginBottom: '30px'}}>
          <div className="row flex-1 align-self-flex-end">
            <input className="flex-1" name="character_name" placeholder="Character Name" type="text" value={this.props.character_name} onChange={this.handleFieldChange} />
          </div>
          <div className="row flex-3 flex-wrap">
            <div className="column flex-1">
              <div className="row">
                <input className="flex-1" name="class" placeholder="Class" type="text" value={this.props.class} onChange={this.handleFieldChange} />
                <NumberInput name="level" placeholder="Level" type="number" min="1" value={this.props.level} onChange={this.handleFieldChange} />
              </div>
              <input name="race" placeholder="Race" type="text" value={this.props.race} onChange={this.handleFieldChange} />
            </div>
            <div className="column flex-1">
              <input name="background" placeholder="Background" type="text" value={this.props.background} onChange={this.handleFieldChange} />
              <input name="alignment" placeholder="Alignment" type="text" value={this.props.alignment} onChange={this.handleFieldChange} />
            </div>
            <div className="column flex-1">
              <input name="player_name" placeholder="Player Name" type="text" value={this.props.player_name} onChange={this.handleFieldChange} />
              <NumberInput name="experience_points" placeholder="XP" type="number" min="0" value={this.props.experience_points} onChange={this.handleFieldChange} />
            </div>
          </div>
        </div>
        <div className="main-body" style={{margin: '0 -15px'}}>
          <div className="column flex-1" style={{padding: '0 15px'}}>
            <div className="column">
              <div className="row justify-content-space-around">
                <div className="column justify-content-space-around" style={{backgroundColor: '#E5E5E5'}}>
                  {attributes}
                </div>
                <div className="column">
                  <div className="column align-items-center">
                    <NumberInput name="proficiency_bonus" type="number" min="0" value={this.props.proficiency_bonus} onChange={this.handleFieldChange} />
                    <h4><label className="fs-smaller" htmlFor="proficiency_bonus">Proficiency Bonus</label></h4>
                  </div>
                  <div className="column fs-smaller">
                    {savingThrows}
                    <h4>Saving Throws</h4>
                  </div>
                  <div className="column fs-smaller">
                    {skills}
                    <h4>Skills</h4>
                  </div>
                </div>
              </div>
            </div>
            <div className="column align-items-center">
              <NumberInput name="passive_perception" type="number" min="0" value={this.props.passive_perception} onChange={this.handleFieldChange} />
              <h4><label htmlFor="passive_perception">Passive Perception (Wisdom)</label></h4>
            </div>
            <div className="column flex-1">
              <div className="column flex-1" style={{marginBottom: '20px'}}>
                <label htmlFor="proficiencies">Proficiencies</label>
                <textarea name="proficiencies" value={this.props.proficiencies} onChange={this.handleTextAreaChange} />
              </div>
              <div className="column flex-1" style={{marginBottom: '20px'}}>
                <label htmlFor="languages">Languages</label>
                <textarea name="languages" value={this.props.languages} onChange={this.handleTextAreaChange} />
              </div>
              <div className="column flex-1">
                <label htmlFor="expertise">Expertise</label>
                <textarea name="expertise" value={this.props.expertise} onChange={this.handleTextAreaChange} />
              </div>
              <h4>Other Proficiencies &amp; Languages</h4>
            </div>
          </div>
          <div className="column flex-1" style={{padding: '0 15px'}}>
            <div className="column">
              <div className="row justify-content-space-around">
                <div className="column align-items-center">
                  <NumberInput name="armor_class" type="number" min="0" max="25" value={this.props.armor_class} onChange={this.handleFieldChange} />
                  <label htmlFor="armor_class">Armor Class</label>
                </div>
                <div className="column align-items-center">
                  <NumberInput name="initiative_bonus" type="number" min="0" max="10" value={this.props.initiative_bonus} onChange={this.handleFieldChange} />
                  <label htmlFor="initiative">Initiative</label>
                </div>
                <div className="column align-items-center">
                  <div>
                    <NumberInput name="speed" type="number" min="0" max="100" value={this.props.speed} onChange={this.handleFieldChange} />
                    <span className="align-self-center">ft</span>
                  </div>
                  <label htmlFor="speed">Speed</label>
                </div>
              </div>
              <div className="row justify-content-space-around">
                <div className="column align-items-center">
                  <span>&nbsp;</span>
                  <NumberInput name="current_hit_points" type="number" min="0" max={this.props.maximum_hit_points} value={this.props.current_hit_points} onChange={this.handleFieldChange} />
                  <h4><label htmlFor="current_hit_points">HP</label></h4>
                </div>
                <div className="column align-items-center">
                  <span>&nbsp;</span>
                  <NumberInput name="maximum_hit_points" type="number" min="0" max="1000" value={this.props.maximum_hit_points} onChange={this.handleFieldChange} />
                  <label htmlFor="maximum_hit_points">Max HP</label>
                </div>
                <div className="column align-items-center">
                  <span>Total: {this.props.level}d{Compendium.hit_dice_for_class[this.props.class]}</span>
                  <NumberInput name="current_hit_dice" type="number" min="0" max={this.props.level} value={this.props.current_hit_dice} onChange={this.handleFieldChange} />
                  <label htmlFor="hit_dice">Hit Dice</label>
                </div>
                <div className="column align-items-center">
                  <span>&nbsp;</span>
                  <NumberInput name="temporary_hit_points" type="number" min="0" value={this.props.temporary_hit_points} onChange={this.handleFieldChange} />
                  <label htmlFor="temporary_hit_points">Temp HP</label>
                </div>
              </div>
            </div>
            <div className="column flex-1">
              {attacks}
              <textarea className="flex-1" name="special_abilities" value={this.props.special_abilities} onChange={this.handleTextAreaChange} />
              <h4>Attacks &amp; Spellcasting</h4>
            </div>
            <div className="column flex-1">
              <div className="row justify-content-space-around">
                {coins}
              </div>
              <div className="column flex-1">
                <textarea className="flex-1" name="equipment" value={this.props.equipment} onChange={this.handleTextAreaChange} />
                <h4>Equipment</h4>
              </div>
            </div>
          </div>
          <div className="column flex-1" style={{padding: '0 15px'}}>
            <div className="column">
              <div className="column">
                <textarea name="personality_traits" value={this.props.personality_traits} onChange={this.handleTextAreaChange} />
                <h4>Personality Traits</h4>
              </div>
              <div className="column">
                <textarea name="ideals" value={this.props.ideals} onChange={this.handleTextAreaChange} />
                <h4>Ideals</h4>
              </div>
              <div className="column">
                <textarea name="bonds" value={this.props.bonds} onChange={this.handleTextAreaChange} />
                <h4>Bonds</h4>
              </div>
              <div className="column">
                <textarea name="flaws" value={this.props.flaws} onChange={this.handleTextAreaChange} />
                <h4>Flaws</h4>
              </div>
            </div>
            <div className="column flex-1">
              <textarea name="features_and_traits" value={this.props.features_and_traits} onChange={this.handleTextAreaChange} />
              <h4>Features &amp; Traits</h4>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default CharacterSheet;
