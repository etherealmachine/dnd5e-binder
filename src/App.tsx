import * as React from 'react';
import './App.css';

class App extends React.Component {
  public render() {
    return (
      <div className="App">
        <div className="column">
          <div className="row">
            <div className="column">
              <input type="text" placeholder="Character Name" name="character_name" />
            </div>
            <div className="row">
              <div className="column">
                <div>
                  <input type="text" placeholder="Class" name="class" />
                  <input type="number" min="1" max="100" placeholder="Level" name="level" />
                </div>
                <input type="text" placeholder="Race" name="race" />
              </div>
              <div className="column">
                <input type="text" placeholder="Background" name="background" />
                <input type="text" placeholder="Alignment" name="alignment" />
              </div>
              <div className="column">
                <input type="text" placeholder="Player Name" name="player_name" />
                <input type="number" min="1" max="100" placeholder="Experience Points" name="xp" />
              </div>
            </div>
          </div>
        </div>
        {false &&
          <div>
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
            <div className="column">
              <div className="row">
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
                <h4>Hit Point Maximum</h4>
                <h4>Current Hit Points</h4>
              </div>
              <div>
                <h4>Temporary Hit Points</h4>
              </div>
              <div className="row">
                <div>
                  <h4>Hit Dice Maximum</h4>
                  <h4>Hit Dice</h4>
                </div>
                <div>
                  <h4>Success</h4>
                  <h4>Failure</h4>
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
        }
      </div>
    );
  }
}

export default App;
