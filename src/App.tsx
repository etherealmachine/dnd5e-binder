import "core-js/library";
import * as React from 'react';
import './App.css';

export interface Props {
}

class App extends React.Component<Props, any> {

  public constructor(props: any) {
    super(props);
    this.state = JSON.parse(window.localStorage.getItem('state') || "null") || {
      character_name: undefined,
      class: undefined,
      level: undefined,
      race: undefined,
      background: undefined,
      alignment: undefined,
      player_name: undefined,
      experience_points: undefined,
      strength: undefined,
      dexterity: undefined,
      constitution: undefined,
      intelligence: undefined,
      wisdom: undefined,
      charisma: undefined,
      inspiration: false,
      proficiency_bonus: undefined,
      strength_saving_throw_proficiency: false,
      strength_saving_throw_bonus: undefined,
      dexterity_saving_throw_proficiency: false,
      dexterity_saving_throw_bonus: undefined,
      constitution_saving_throw_proficiency: false,
      constitution_saving_throw_bonus: undefined,
      intelligence_saving_throw_proficiency: false,
      intelligence_saving_throw_bonus: undefined,
      wisdom_saving_throw_proficiency: false,
      wisdom_saving_throw_bonus: undefined,
      charisma_saving_throw_proficiency: false,
      charisma_saving_throw_bonus: undefined,
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
                </div>
                <div className="column">
                  {skills}
                </div>
              </div>
            </div>
          </div>
          <div>
          </div>
          <div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
