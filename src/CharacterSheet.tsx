import "core-js/library";
import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import { State as AppState } from './store';
import { Background, Compendium } from './compendium';
import { CharacterState } from './store';

export interface Props extends CharacterState {
  compendium: Compendium
  dispatch: Dispatch
}

interface State {
}

class CharacterSheet extends React.Component<Props, State> {

  public constructor(props: Props) {
    super(props);
    this.state = {};
  }

  public static mapStateToProps(state: AppState): Partial<Props> {
    return {
      compendium: state.app.compendium,
    };
  }

  public static mapDispatchToProps(dispatch: Dispatch): Partial<Props> {
    return {
      dispatch: dispatch,
    };
  }

  private renderBackground = (background: Background): JSX.Element => {
    const content: JSX.Element[] = [];
    const traits = background.trait;
    traits.forEach((trait: any) => {
      let text = trait.text;
      if (!(trait.text instanceof Array)) {
        text = [trait.text];
      }
      content.push(
        <p key={content.length}><span className="term">{trait.name}:</span>&nbsp;{(text as string[]).map((t, j) => <span key={j}>{t}<br /></span>)}</p>)
    });
    return <div>
      <h2>{background.name}</h2>
      <p><span className="term">Proficiency:</span> {background.proficiency}</p>
      {content}
    </div>;
  }

  public render() {
    const background = this.props.compendium.backgrounds[this.props.background];
    return this.renderBackground(background);
  }
}

export default connect(CharacterSheet.mapStateToProps, CharacterSheet.mapDispatchToProps)(CharacterSheet);
