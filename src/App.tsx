import "core-js/library";
import * as React from 'react';
import './App.css';

export interface Props {
}

class App extends React.Component<Props, any> {

  public constructor(props: any) {
    super(props);
    this.state = JSON.parse(window.localStorage.getItem('state') || "null") || {
      character_name: '',
      class: '',
      level: '',
      race: '',
      background: '',
      alignment: '',
      player_name: '',
      experience_points: '',
      strength: '',
      dexterity: '',
      constitution: '',
      intelligence: '',
      wisdom: '',
      charisma: '',
      inspiration: false,
      proficiency_bonus: '',
      passive_perception: '',
      strength_saving_throw_proficiency: false,
      strength_saving_throw_bonus: '',
      dexterity_saving_throw_proficiency: false,
      dexterity_saving_throw_bonus: '',
      constitution_saving_throw_proficiency: false,
      constitution_saving_throw_bonus: '',
      intelligence_saving_throw_proficiency: false,
      intelligence_saving_throw_bonus: '',
      wisdom_saving_throw_proficiency: false,
      wisdom_saving_throw_bonus: '',
      charisma_saving_throw_proficiency: false,
      charisma_saving_throw_bonus: '',
      attack1_name: '',
      attack2_name: '',
      attack3_name: '',
      attack1_bonus: '',
      attack2_bonus: '',
      attack3_bonus: '',
      attack1_damage_type: '',
      attack2_damage_type: '',
      attack3_damage_type: '',
      maximum_hit_points: '',
      current_hit_points: '',
      temporary_hit_points: '',
    };

    this.handleChange = this.handleChange.bind(this);
  }

  public componentDidUpdate(prevProps: Props, prevState: any) {
    window.localStorage.setItem('state', JSON.stringify(this.state));
  }

  private handleChange(event: any) {
    if (event.target.type === 'checkbox') {
      this.setState({[event.target.name]: event.target.checked});
    } else {
      this.setState({[event.target.name]: event.target.value});
    }
  }

  public render() {
    const stats: JSX.Element[] = [];
    const statSavingThrows: JSX.Element[] = [];
    Object.entries({
      'Strength': 'STR',
      'Dexterity': 'DEX',
      'Constitution': 'CON',
      'Intelligence': 'INT',
      'Wisdom': 'WIS',
      'Charisma': 'CHA',
    }).forEach(([stat, shortName]) => {
      stats.push(
        <div key={`${stat}-stat`}>
          <input name={stat} placeholder={shortName} type="number" min="0" max="20" value={this.state[stat]} onChange={this.handleChange} />
        </div>
      );
      statSavingThrows.push(
        <div key={`${stat}-saving-throw`}>
          <input name={`${stat}_saving_throw_proficiency`} type="checkbox" checked={this.state[`${stat}_saving_throw_proficiency`]} onChange={this.handleChange} />
          <input name={`${stat}_saving_throw_bonus`} type="number" min="0" max="10" value={this.state[`${stat}_saving_throw_bonus`]} onChange={this.handleChange} />
          <label htmlFor="strength_saving_throw_bonus">{stat}</label>
        </div>
      );
    })
    const skills: JSX.Element[] = Object.entries({
      'Acrobatics': 'Dex',
      'Animal Handling': 'Wis',
      'Arcana': 'Int',
      'Athletics': 'Str',
      'Deception': 'Cha',
      'History': 'Wis',
      'Insight': 'Wis',
      'Intimidation': 'Cha',
      'Investigation': 'Int',
      'Medicine': 'Wis',
      'Nature': 'Int',
      'Perception': 'Wis',
      'Performance': 'Cha',
      'Persuasion': 'Cha',
      'Religion': 'Int',
      'Slight of Hand': 'Dex',
      'Stealth': 'Dex',
      'Survival': 'Wis',
    }).map(([skill, stat]) => {
      return <div key={skill}>
        <input name={`${skill}_proficiency}`} type="checkbox" checked={this.state[`${skill}_proficiency}`]} onChange={this.handleChange} />
        <input name={`${skill}_bonus`} type="number" min="0" max="10" value={this.state[`${skill}_bonus`]} onChange={this.handleChange} />
        <label htmlFor={`${skill}_bonus`}>{skill}<span className="fc-gray-1">{`(${stat})`}</span></label>
      </div>
    });
    const coins: JSX.Element[] = Object.entries({
      'Copper': 'CP',
      'Silver': 'SP',
      'Electrum': 'EP',
      'Gold': 'GP',
      'Platinum': 'PP',
    }).map(([coin, shortName]) => {
      return <div key={coin}>
        <label htmlFor={coin}>{shortName}</label>
        <input name={coin} type="number" min="0" value={this.state[coin]} onChange={this.handleChange} />
      </div>
    });
    const attacks = (
      <div>
        <div className="column">
          <span>Name</span>
          <input name="attack1_name" type="text" value={this.state.attack1_name} onChange={this.handleChange} />
          <input name="attack2_name" type="text" value={this.state.attack2_name} onChange={this.handleChange} />
          <input name="attack3_name" type="text" value={this.state.attack3_name} onChange={this.handleChange} />
        </div>
        <div className="column">
          <span>Bonus</span>
          <input name="attack1_bonus" type="number" min="0" max="10" value={this.state.attack1_bonus} onChange={this.handleChange} />
          <input name="attack2_bonus" type="number" min="0" max="10" value={this.state.attack2_bonus} onChange={this.handleChange} />
          <input name="attack3_bonus" type="number" min="0" max="10" value={this.state.attack3_bonus} onChange={this.handleChange} />
        </div>
        <div className="column">
          <span>Damage Type</span>
          <input name="attack1_damage_type" type="text" value={this.state.attack1_damage_type} onChange={this.handleChange} />
          <input name="attack2_damage_type" type="text" value={this.state.attack2_damage_type} onChange={this.handleChange} />
          <input name="attack3_damage_type" type="text" value={this.state.attack3_damage_type} onChange={this.handleChange} />
        </div>
      </div>);
    return (
      <div className="App column">
        <div>
          <input name="character_name" placeholder="Character Name" type="text" value={this.state.character_name} onChange={this.handleChange} />
          <div>
            <div className="column">
              <div>
                <input name="class" placeholder="Class" type="text" value={this.state.class} onChange={this.handleChange} />
                <input name="level" placeholder="Level" type="number" min="0" max="100" value={this.state.level} onChange={this.handleChange} />
              </div>
              <input name="race" placeholder="Race" type="text" value={this.state.race} onChange={this.handleChange} />
            </div>
            <div className="column">
              <input name="background" placeholder="Background" type="text" value={this.state.background} onChange={this.handleChange} />
              <input name="alignment" placeholder="Alignment" type="text" value={this.state.alignment} onChange={this.handleChange} />
            </div>
            <div className="column">
              <input name="player_name" placeholder="Player Name" type="text" value={this.state.player_name} onChange={this.handleChange} />
              <input name="experience_points" placeholder="Experience Points" type="number" min="0" value={this.state.experience_points} onChange={this.handleChange} />
            </div>
          </div>
        </div>
        <div>
          <div className="column">
            <div className="column">
              <div>
                <div className="column">
                  {stats}
                </div>
                <div className="column">
                  <div>
                    <input name="inspiration" type="checkbox" checked={this.state.inspiration} onChange={this.handleChange} />
                    <label htmlFor="inspiration">Inspiration</label>
                  </div>
                  <div>
                    <input name="proficiency_bonus" type="number" min="0" max="10" value={this.state.proficiency_bonus} onChange={this.handleChange} />
                    <label htmlFor="proficiency_bonus">Proficiency Bonus</label>
                  </div>
                  <div className="column">
                    {statSavingThrows}
                    <h4>Saving Throws</h4>
                  </div>
                  <div className="column">
                    {skills}
                    <h4>Skills</h4>
                  </div>
                  <div>
                    <input name="passive_perception" type="checkbox" checked={this.state.passive_perception} onChange={this.handleChange} />
                    <label htmlFor="passive_perception">Passive Perception (Wis)</label>
                  </div>
                </div>
              </div>
            </div>
            <div className="column">
              <div>
                <label htmlFor="proficiencies">Proficiencies:</label>
                <textarea name="proficiencies" value={this.state.proficiencies} onChange={this.handleChange} />
              </div>
              <div>
                <label htmlFor="languages">Languages:</label>
                <textarea name="languages" value={this.state.languages} onChange={this.handleChange} />
              </div>
              <div>
                <label htmlFor="expertise">Expertise:</label>
                <textarea name="expertise" value={this.state.expertise} onChange={this.handleChange} />
              </div>
              <h4>Other Proficiencies &amp; Languages</h4>
            </div>
          </div>
          <div className="column">
            <div className="column">
              <div>
                <div className="column">
                  <input name="armor_class" type="number" min="0" max="25" value={this.state.armor_class} onChange={this.handleChange} />
                  <label htmlFor="armor_class">Armor Class</label>
                </div>
                <div className="column">
                  <input name="initiative" type="number" min="0" max="10" value={this.state.initiative} onChange={this.handleChange} />
                  <label htmlFor="initiative">Initiative</label>
                </div>
                <div className="column">
                  <div>
                    <input name="speed" type="number" min="0" max="100" value={this.state.speed} onChange={this.handleChange} />
                    <span>ft</span>
                  </div>
                  <label htmlFor="speed">Speed</label>
                </div>
              </div>
              <div className="column">
                <div>
                  <label htmlFor="maximum_hit_points">Maximum Hit Points:</label>
                  <input name="maximum_hit_points" type="number" min="0" max="1000" value={this.state.maximum_hit_points} onChange={this.handleChange} />
                </div>
                <input name="current_hit_points" type="number" min="0" max={this.state.maximum_hit_points} value={this.state.current_hit_points} onChange={this.handleChange} />
                <h4>Current Hit Points</h4>
              </div>
              <div className="column">
                <input name="temporary_hit_points" type="number" min="0" value={this.state.temporary_hit_points} onChange={this.handleChange} />
                <label htmlFor="temporary_hit_points">Temporary Hit Points</label>
              </div>
              <div>
                <div className="column">
                  <span>Total: {this.state.level}d{this.state.class}</span>
                  <input name="current_hit_dice" type="number" min="0" max={this.state.level} onChange={this.handleChange} />
                  <label htmlFor="hit_dice">Hit Dice</label>
                </div>
                <div></div>
              </div>
            </div>
            <div className="column">
              {attacks}
              <textarea name="special_abilities" value={this.state.special_abilities} onChange={this.handleChange} />
              <h4>Attacks &amp; Spellcasting</h4>
            </div>
            <div className="column">
              <div>
                <div className="column">
                  {coins}
                </div>
                <textarea name="equipment" value={this.state.equipment} onChange={this.handleChange} />
              </div>
              <h4>Equipment</h4>
            </div>
          </div>
          <div className="column">
          </div>
        </div>
      </div>
    );
  }
}

export default App;
