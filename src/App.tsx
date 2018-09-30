import * as React from 'react';
import './App.css';

class App extends React.Component {
  public render() {
    return (
      <div className="App">
        <div style={{"display": "flex", "flexDirection": "column"}}>
          <div style={{"display": "flex", "flexDirection": "row"}}>
            <input type="text" placeholder="Character Name" name="character_name" />
            <input type="text" placeholder="Player Name" name="player_name" />
          </div>
          <div style={{"display": "flex", "flexDirection": "row"}}>
            <input type="text" placeholder="Class" name="class" />
            <input type="number" min="1" max="100" placeholder="Level" name="level" />
          </div>
          <div style={{"display": "flex", "flexDirection": "row"}}>
            <input type="text" placeholder="Race" name="race" />
            <input type="text" placeholder="Alignment" name="alignment" />
          </div>
        </div>
        <div>
          <input type="number" placeholder="Strength" name="strength" />
          <input type="number" placeholder="Dexterity" name="dexterity" />
          <input type="number" placeholder="Constitution" name="constitution" />
          <input type="number" placeholder="Intelligence" name="intelligence" />
          <input type="number" placeholder="Wisdom" name="wisdom" />
          <input type="number" placeholder="Charisma" name="charisma" />
        </div>
        <div>
          <h4>Personality Traits</h4>
          <h4>Ideals</h4>
          <h4>Bonds</h4>
          <h4>Flaws</h4>
        </div>
        <div style={{"display": "flex", "flexDirection": "column"}}>
          <div style={{"display": "flex", "flexDirection": "row"}}>
            <div>
              <h4>Armor Class</h4>
            </div>
            <div>
              <h4>Initiative</h4>
            </div>
            <div>
              <h4>Speed</h4>
            </div>
          </div>
          <div>
            <h4>Current Hit Points</h4>
          </div>
          <div>
            <h4>Temporary Hit Points</h4>
          </div>
          <div style={{"display": "flex", "flexDirection": "row"}}>
            <div>
              <h4>Hit Dice</h4>
            </div>
            <div>
              <h4>Death Saving Throws</h4>
            </div>
          </div>
        </div>
        <div>
          <h4>Saving Throws</h4>
        </div>
        <div>
          <h4>Skills</h4>
        </div>
        <div>
          <h4>Attacks &amp; Spellcasting</h4>
        </div>
        <div>
          <h4>Features &amp; Traits</h4>
        </div>
        <div>
          <h4>Equipment</h4>
        </div>
        <div>
          <h4>Proficiencies &amp; Languages</h4>
        </div>
      </div>
    );
  }
}

export default App;
