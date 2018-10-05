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
    return Math.floor((this.state[attr]-10)/2);
  }

  private skillBonus(skill: string, attr: string): number {
    if (this.state[`${skill}_proficiency}`]) {
      return (this.state.proficiency_bonus || 0) + this.attributeBonus(attr);
    }
    return this.attributeBonus(attr);
  }

  public render() {
    const stats: JSX.Element[] = [];
    const statSavingThrows: JSX.Element[] = [];
    Rules.attributes.forEach((attr) => {
      stats.push(
        <div key={`${attr}-attr`} className="column" style={{alignItems: 'center', padding: '10px 0'}}>
          <span>{this.attributeBonus(attr)}</span>
          <input name={attr} placeholder={attr} type="number" min="0" max="20" value={this.state[attr]} onChange={this.state.handleInputChange} />
          <label>{attr}</label>
        </div>
      );
      statSavingThrows.push(
        <div key={`${attr}-saving-throw`} style={{alignItems: 'center'}}>
          <input name={`${attr}_saving_throw_proficiency`} type="checkbox" checked={this.state[`${attr}_saving_throw_proficiency`]} onChange={this.state.handleInputChange} />
          <input name={`${attr}_saving_throw_bonus`} type="number" min="0" max="10" value={this.state[`${attr}_saving_throw_bonus`]} onChange={this.state.handleInputChange} />
          <label htmlFor="strength_saving_throw_bonus">{attr}</label>
        </div>
      );
    })
    const skills: JSX.Element[] = Object.entries(Rules.skills).map(([skill, attr]) => {
      return <div key={skill} style={{alignItems: 'center'}}>
        <input name={`${skill}_proficiency}`} type="checkbox" checked={this.state[`${skill}_proficiency}`]} onChange={this.state.handleInputChange} />
        <span>{this.skillBonus(skill, attr)}</span>
        <label htmlFor={`${skill}_bonus`}>{skill}&nbsp;<span className="fc-gray-1">({attr})</span></label>
      </div>
    });
    const coins: JSX.Element[] = Rules.coinage.map((coin) => {
      return <div key={coin}>
        <label htmlFor={coin}>{coin}</label>
        <input name={coin} type="number" min="0" value={this.state[coin]} onChange={this.state.handleInputChange} />
      </div>
    });
    const attacks = (
      <div>
        <div className="column">
          <span>Name</span>
        </div>
        <div className="column">
          <span>Bonus</span>
        </div>
        <div className="column">
          <span>Damage Type</span>
        </div>
        <div className="column">
          <span>&nbsp;</span>
          <button onClick={this.state.handleButtonClick}>+</button>
        </div>
      </div>);
    return (
      <div className="App column" style={{alignSelf: 'center', maxWidth: '80%', marginTop: '20px'}}>
        <div style={{flex: '1'}}>
          <input name="character_name" placeholder="Character Name" type="text" value={this.state.character_name} onChange={this.state.handleInputChange} style={{flex: '1'}}/>
          <div style={{flex: '3'}}>
            <div className="column" style={{flex: '1'}}>
              <div>
                <input name="class" placeholder="Class" type="text" value={this.state.class} onChange={this.state.handleInputChange} />
                <input name="level" placeholder="Level" type="number" min="0" max="100" value={this.state.level} onChange={this.state.handleInputChange} />
              </div>
              <input name="race" placeholder="Race" type="text" value={this.state.race} onChange={this.state.handleInputChange} />
            </div>
            <div className="column" style={{flex: '1'}}>
              <input name="background" placeholder="Background" type="text" value={this.state.background} onChange={this.state.handleInputChange} />
              <input name="alignment" placeholder="Alignment" type="text" value={this.state.alignment} onChange={this.state.handleInputChange} />
            </div>
            <div className="column" style={{flex: '1'}}>
              <input name="player_name" placeholder="Player Name" type="text" value={this.state.player_name} onChange={this.state.handleInputChange} />
              <input name="experience_points" placeholder="XP" type="number" min="0" value={this.state.experience_points} onChange={this.state.handleInputChange} />
            </div>
          </div>
        </div>
        <div>
          <div className="column" style={{flex: '1'}}>
            <div className="column">
              <div>
                <div className="column">
                  {stats}
                </div>
                <div className="column">
                  <div style={{alignItems: 'center'}}>
                    <input name="proficiency_bonus" type="number" min="0" max="10" value={this.state.proficiency_bonus} onChange={this.state.handleInputChange} />
                    <label htmlFor="proficiency_bonus">Proficiency Bonus</label>
                  </div>
                  <div className="column fs-smaller">
                    {statSavingThrows}
                    <h4 style={{alignSelf: 'center'}}>Saving Throws</h4>
                  </div>
                  <div className="column fs-smaller">
                    {skills}
                    <h4 style={{alignSelf: 'center'}}>Skills</h4>
                  </div>
                  <div>
                    <input name="passive_perception" value={this.state.passive_perception} onChange={this.state.handleInputChange} />
                    <label htmlFor="passive_perception">Passive Perception (Wisdom)</label>
                  </div>
                </div>
              </div>
            </div>
            <div className="column">
              <div>
                <label htmlFor="proficiencies">Proficiencies:</label>
                <textarea name="proficiencies" value={this.state.proficiencies} onChange={this.state.handleTextAreaChange} />
              </div>
              <div>
                <label htmlFor="languages">Languages:</label>
                <textarea name="languages" value={this.state.languages} onChange={this.state.handleTextAreaChange} />
              </div>
              <div>
                <label htmlFor="expertise">Expertise:</label>
                <textarea name="expertise" value={this.state.expertise} onChange={this.state.handleTextAreaChange} />
              </div>
              <h4 style={{alignSelf: 'center'}}>Other Proficiencies &amp; Languages</h4>
            </div>
          </div>
          <div className="column" style={{flex: '1'}}>
            <div className="column">
              <div>
                <div className="column">
                  <input name="armor_class" type="number" min="0" max="25" value={this.state.armor_class} onChange={this.state.handleInputChange} />
                  <label htmlFor="armor_class">Armor Class</label>
                </div>
                <div className="column">
                  <input name="initiative" type="number" min="0" max="10" value={this.state.initiative_bonus} onChange={this.state.handleInputChange} />
                  <label htmlFor="initiative">Initiative</label>
                </div>
                <div className="column">
                  <div>
                    <input name="speed" type="number" min="0" max="100" value={this.state.speed} onChange={this.state.handleInputChange} />
                    <span>ft</span>
                  </div>
                  <label htmlFor="speed">Speed</label>
                </div>
              </div>
              <div className="column">
                <div>
                  <label htmlFor="maximum_hit_points">Maximum Hit Points:</label>
                  <input name="maximum_hit_points" type="number" min="0" max="1000" value={this.state.maximum_hit_points} onChange={this.state.handleInputChange} />
                </div>
                <input name="current_hit_points" type="number" min="0" max={this.state.maximum_hit_points} value={this.state.current_hit_points} onChange={this.state.handleInputChange} />
                <h4>Current Hit Points</h4>
              </div>
              <div className="column">
                <input name="temporary_hit_points" type="number" min="0" value={this.state.temporary_hit_points} onChange={this.state.handleInputChange} />
                <label htmlFor="temporary_hit_points">Temporary Hit Points</label>
              </div>
              <div>
                <div className="column">
                  <span>Total: {this.state.level}d{this.state.class}</span>
                  <input name="current_hit_dice" type="number" min="0" max={this.state.level} onChange={this.state.handleInputChange} />
                  <label htmlFor="hit_dice">Hit Dice</label>
                </div>
                <div></div>
              </div>
            </div>
            <div className="column">
              {attacks}
              <textarea name="special_abilities" value={this.state.special_abilities} onChange={this.state.handleTextAreaChange} />
              <h4 style={{alignSelf: 'center'}}>Attacks &amp; Spellcasting</h4>
            </div>
            <div className="column">
              <div>
                <div className="column">
                  {coins}
                </div>
                <textarea name="equipment" value={this.state.equipment} onChange={this.state.handleTextAreaChange} />
              </div>
              <h4 style={{alignSelf: 'center'}}>Equipment</h4>
            </div>
          </div>
          <div className="column" style={{flex: '1'}}>
            <div className="column">
              <div className="column">
                <textarea name="personality_traits" value={this.state.personality_traits} onChange={this.state.handleTextAreaChange} />
                <h4 style={{alignSelf: 'center'}}>Personality Traits</h4>
              </div>
              <div className="column">
                <textarea name="ideals" value={this.state.ideals} onChange={this.state.handleTextAreaChange} />
                <h4 style={{alignSelf: 'center'}}>Ideals</h4>
              </div>
              <div className="column">
                <textarea name="bonds" value={this.state.bonds} onChange={this.state.handleTextAreaChange} />
                <h4 style={{alignSelf: 'center'}}>Bonds</h4>
              </div>
              <div className="column">
                <textarea name="flaws" value={this.state.flaws} onChange={this.state.handleTextAreaChange} />
                <h4 style={{alignSelf: 'center'}}>Flaws</h4>
              </div>
            </div>
            <div className="column">
              <textarea name="features_and_traits" value={this.state.features_and_traits} onChange={this.state.handleTextAreaChange} />
              <h4 style={{alignSelf: 'center'}}>Features &amp; Traits</h4>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
