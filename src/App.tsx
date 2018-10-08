import "core-js/library";
import * as React from 'react';
import './App.css';
import CharacterSheet from './CharacterSheet';

export interface Props {
}

class App extends React.Component<Props> {

  public render() {
    return <div className="container">
      <CharacterSheet />
    </div>;
  }
}

export default App;
