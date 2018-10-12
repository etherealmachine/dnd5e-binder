import "core-js/library";
import * as React from 'react';

import './CharacterSheet.css';

export interface Props {
}

interface State {
}

class MonsterCard extends React.Component<Props, State> {

  public constructor(props: Props) {
    super(props);
    this.state = {
    };
  }

  public render() {
  	return <div>I'm a monster.</div>;
  }
}

export default MonsterCard;