import "core-js/library";
import * as React from 'react';
import './App.css';
import State from './state';
import Rules from './rules';

export interface Props {
}

class App extends React.Component<Props, State> {

  public constructor(props: Props) {
    super(props);
    this.state = new State(this.setState.bind(this));
  }

  private attributeBonus(attr: string): number {
    if (this.state[attr] === '') {
      return NaN;
    }
    return Math.floor((parseInt(this.state[attr] as string)-10)/2);
  }

  private skillBonus(skill: string, attr: string): number {
    if (this.state[`${skill}_proficiency}`] && this.state.proficiency_bonus !== '') {
      return parseInt(this.state.proficiency_bonus as string) + this.attributeBonus(attr);
    }
    return this.attributeBonus(attr);
  }

  private savingThrowBonus(attr: string): number {
    if (this.state[`${attr}_saving_throw_proficiency`] && this.state.proficiency_bonus !== '') {
      return this.attributeBonus(attr) + parseInt(this.state.proficiency_bonus as string);
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

  public render() {
    const attributes: JSX.Element[] = [];
    const savingThrows: JSX.Element[] = [];
    Rules.attributes.forEach((attr) => {
      attributes.push(
        <div key={`${attr}-attr`} className="column align-items-center" style={{padding: '10px 0'}}>
          <span>{this.bonusText(this.attributeBonus(attr))}</span>
          <input name={attr} placeholder={attr.slice(0,3)} type="number" min="0" max="20" value={this.state[attr]} onChange={this.state.handleInputChange} />
          <label>{attr}</label>
        </div>
      );
      savingThrows.push(
        <div key={`${attr}-saving-throw`} className="align-items-center">
          <input name={`${attr}_saving_throw_proficiency`} type="checkbox" checked={this.state[`${attr}_saving_throw_proficiency`]} onChange={this.state.handleInputChange} />
          <span>{attr}</span>
          <span className="bonus">{this.bonusText(this.savingThrowBonus(attr))}</span>
        </div>
      );
    })
    const skills: JSX.Element[] = Object.entries(Rules.skills).map(([skill, attr]) => {
      return <div key={skill} className="align-items-center">
        <input name={`${skill}_proficiency}`} type="checkbox" checked={this.state[`${skill}_proficiency}`]} onChange={this.state.handleInputChange} />
        <span>{skill}&nbsp;<span className="fc-gray-1">({attr})</span></span>
        <span className="bonus">{this.bonusText(this.skillBonus(skill, attr))}</span>
      </div>
    });
    const coins: JSX.Element[] = Rules.coinage.map((coin) => {
      return <div key={coin} className="align-items-center">
        <label className="flex-1" htmlFor={coin}>{coin}</label>
        <input name={coin} type="number" min="0" value={this.state[coin]} onChange={this.state.handleInputChange} />
      </div>
    });
    const attacks = (
      <div className="column">
        {this.state.attacks.map((attack, i) => {
          return (<div key={`attack-${i}`} className="align-items-center">
            <input name="attacks" data-index={i} data-key="name" value={this.state.attacks[i].name} onChange={this.state.handleInputChange} />
            <input name="attacks" type="number" min="0" data-index={i} data-key="bonus" value={this.state.attacks[i].bonus} onChange={this.state.handleInputChange} />
            <input name="attacks" data-index={i} data-key="damage_type"  value={this.state.attacks[i].damage_type} onChange={this.state.handleInputChange} />
            <button name="remove_attack" data-index={i} onClick={this.state.handleButtonClick}>-</button>
          </div>);
        })}
        <div className="align-items-center">
          <div className="column">
            <input name="new_attack_name" type="text" value={this.state.new_attack_name} onChange={this.state.handleInputChange} />
            <span className="align-self-center">Name</span>
          </div>
          <div className="column">
            <input name="new_attack_bonus" type="number" min="0" value={this.state.new_attack_bonus} onChange={this.state.handleInputChange} />
            <span className="align-self-center">Bonus</span>
          </div>
          <div className="column">
            <input name="new_attack_damage_type" type="text" value={this.state.new_attack_damage_type} onChange={this.state.handleInputChange} />
            <span className="align-self-center">Damage Type</span>
          </div>
          <div className="column">
            <button name="add_attack" onClick={this.state.handleButtonClick}>+</button>
            <span>&nbsp;</span>
          </div>
        </div>
      </div>);
    return (
      <div className="App column">
        <div className="flex-1">
          <input className="flex-1" style={{alignSelf: 'flex-end'}} name="character_name" placeholder="Character Name" type="text" value={this.state.character_name} onChange={this.state.handleInputChange} />
          <div className="flex-3">
            <div className="column flex-1">
              <div>
                <input className="flex-1" name="class" placeholder="Class" type="text" value={this.state.class} onChange={this.state.handleInputChange} />
                <input name="level" placeholder="Level" type="number" min="1" value={this.state.level} onChange={this.state.handleInputChange} />
              </div>
              <input name="race" placeholder="Race" type="text" value={this.state.race} onChange={this.state.handleInputChange} />
            </div>
            <div className="column flex-1">
              <input name="background" placeholder="Background" type="text" value={this.state.background} onChange={this.state.handleInputChange} />
              <input name="alignment" placeholder="Alignment" type="text" value={this.state.alignment} onChange={this.state.handleInputChange} />
            </div>
            <div className="column flex-1">
              <input name="player_name" placeholder="Player Name" type="text" value={this.state.player_name} onChange={this.state.handleInputChange} />
              <input name="experience_points" placeholder="XP" type="number" min="0" value={this.state.experience_points} onChange={this.state.handleInputChange} />
            </div>
          </div>
        </div>
        <div>
          <div className="main-column column flex-1">
            <div className="column">
              <div>
                <div className="column">
                  {attributes}
                </div>
                <div className="column">
                  <div className="column align-items-center">
                    <input name="proficiency_bonus" type="number" min="0" value={this.state.proficiency_bonus} onChange={this.state.handleInputChange} />
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
                  <div className="column align-items-center">
                    <input name="passive_perception" type="number" min="0" value={this.state.passive_perception} onChange={this.state.handleInputChange} />
                    <h4><label htmlFor="passive_perception">Passive Perception (Wisdom)</label></h4>
                  </div>
                </div>
              </div>
            </div>
            <div className="column flex-1">
              <div className="column flex-1" style={{marginBottom: '20px'}}>
                <label htmlFor="proficiencies">Proficiencies</label>
                <textarea name="proficiencies" value={this.state.proficiencies} onChange={this.state.handleTextAreaChange} />
              </div>
              <div className="column flex-1" style={{marginBottom: '20px'}}>
                <label htmlFor="languages">Languages</label>
                <textarea name="languages" value={this.state.languages} onChange={this.state.handleTextAreaChange} />
              </div>
              <div className="column flex-1">
                <label htmlFor="expertise">Expertise</label>
                <textarea name="expertise" value={this.state.expertise} onChange={this.state.handleTextAreaChange} />
              </div>
              <h4>Other Proficiencies &amp; Languages</h4>
            </div>
          </div>
          <div className="main-column column flex-1">
            <div className="column">
              <div className="justify-content-space-around">
                <div className="column align-items-center">
                  <input name="armor_class" type="number" min="0" max="25" value={this.state.armor_class} onChange={this.state.handleInputChange} />
                  <label htmlFor="armor_class">Armor Class</label>
                </div>
                <div className="column align-items-center">
                  <input name="initiative_bonus" type="number" min="0" max="10" value={this.state.initiative_bonus} onChange={this.state.handleInputChange} />
                  <label htmlFor="initiative">Initiative</label>
                </div>
                <div className="column align-items-center">
                  <div>
                    <input name="speed" type="number" min="0" max="100" value={this.state.speed} onChange={this.state.handleInputChange} />
                    <span className="align-self-center">ft</span>
                  </div>
                  <label htmlFor="speed">Speed</label>
                </div>
              </div>
              <div className="column">
                <div className="column align-items-center">
                  <input name="maximum_hit_points" type="number" min="0" max="1000" value={this.state.maximum_hit_points} onChange={this.state.handleInputChange} />
                  <label htmlFor="maximum_hit_points">Maximum Hit Points</label>
                </div>
                <div className="justify-content-space-around">
                  <div className="column align-items-center">
                    <span>&nbsp;</span>
                    <input name="current_hit_points" type="number" min="0" max={this.state.maximum_hit_points} value={this.state.current_hit_points} onChange={this.state.handleInputChange} />
                    <h4><label htmlFor="current_hit_points">Current HP</label></h4>
                  </div>
                  <div className="column align-items-center">
                    <span>&nbsp;</span>
                    <input name="temporary_hit_points" type="number" min="0" value={this.state.temporary_hit_points} onChange={this.state.handleInputChange} />
                    <label htmlFor="temporary_hit_points">Temporary HP</label>
                  </div>
                  <div className="column align-items-center">
                    <span>Total: {this.state.level}d{Rules.hit_dice_for_class[this.state.class]}</span>
                    <input name="current_hit_dice" type="number" min="0" max={this.state.level} onChange={this.state.handleInputChange} />
                    <label htmlFor="hit_dice">Hit Dice</label>
                  </div>
                 </div>
              </div>
            </div>
            <div className="column flex-1">
              {attacks}
              <textarea className="flex-1" name="special_abilities" value={this.state.special_abilities} onChange={this.state.handleTextAreaChange} />
              <h4>Attacks &amp; Spellcasting</h4>
            </div>
            <div className="column flex-1">
              <div className="flex-1">
                <div className="column">
                  {coins}
                </div>
                <div className="column flex-1">
                  <textarea className="flex-1" name="equipment" value={this.state.equipment} onChange={this.state.handleTextAreaChange} />
                  <h4>Equipment</h4>
                </div>
              </div>
            </div>
          </div>
          <div className="main-column column flex-1">
            <div className="column">
              <div className="column">
                <textarea name="personality_traits" value={this.state.personality_traits} onChange={this.state.handleTextAreaChange} />
                <h4>Personality Traits</h4>
              </div>
              <div className="column">
                <textarea name="ideals" value={this.state.ideals} onChange={this.state.handleTextAreaChange} />
                <h4>Ideals</h4>
              </div>
              <div className="column">
                <textarea name="bonds" value={this.state.bonds} onChange={this.state.handleTextAreaChange} />
                <h4>Bonds</h4>
              </div>
              <div className="column">
                <textarea name="flaws" value={this.state.flaws} onChange={this.state.handleTextAreaChange} />
                <h4>Flaws</h4>
              </div>
            </div>
            <div className="column flex-1">
              <textarea name="features_and_traits" value={this.state.features_and_traits} onChange={this.state.handleTextAreaChange} />
              <h4>Features &amp; Traits</h4>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
