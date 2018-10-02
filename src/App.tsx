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
    };

    this.handleChange = this.handleChange.bind(this);
  }

  public componentDidUpdate(prevProps: Props, prevState: any) {
    window.localStorage.setItem('state', JSON.stringify(this.state));
  }

  private handleChange(event: any) {
    this.setState({[event.target.name]: event.target.value});
  }

  public render() {
    return (
      <div className="App">
        <div>
          <input name="character_name" placeholder="Character Name" type="text" value={this.state.character_name} onChange={this.handleChange} />
          <div>
            <div className="columns">
              <div>
                <input name="class" placeholder="Class" type="text" value={this.state.class} onChange={this.handleChange} />
                <input name="level" placeholder="Level" type="number" min="0" max="100" value={this.state.level} onChange={this.handleChange} />
              </div>
              <input name="race" placeholder="Race" type="text" value={this.state.race} onChange={this.handleChange} />
            </div>
            <div className="columns">
              <input name="background" placeholder="Background" type="text" value={this.state.background} onChange={this.handleChange} />
              <input name="alignment" placeholder="Alignment" type="text" value={this.state.alignment} onChange={this.handleChange} />
            </div>
            <div className="columns">
              <input name="player_name" placeholder="Player Name" type="text" value={this.state.player_name} onChange={this.handleChange} />
              <input name="experience_points" placeholder="Experience Points" type="number" min="0" value={this.state.experience_points} onChange={this.handleChange} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
