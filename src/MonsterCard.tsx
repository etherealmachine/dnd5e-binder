import "core-js/library";
import * as React from 'react';

import './CharacterSheet.css';

class MonsterCard extends React.Component<any> {

  public constructor(props: any) {
    super(props);
  }

  public render() {
  	return <div>
  		<h1>{this.props.name[0]}</h1>
  		<h1>{this.props.alignment[0]}</h1>
  	</div>;
  }
}

export default MonsterCard;