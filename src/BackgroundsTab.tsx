import "core-js/library";
import * as React from 'react';
import { connect } from 'react-redux';

import { Background } from './compendium';
import { State as AppState } from './store';
import SearchableList from './SearchableList';

export interface Props {
  backgrounds: { [key: string]: Background }
}

class BackgroundsTab extends React.Component<Props> {

  public static mapStateToProps(state: AppState): Partial<Props> {
    return {
      backgrounds: state.app.compendium.backgrounds,
    };
  }

  private renderBackground = (background: any, index: number): JSX.Element => {
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
    return <div key={index}>
      <h2>{background.name}</h2>
      <p><span className="term">Proficiency:</span> {background.proficiency}</p>
      {content}
    </div>;
  }

  public render() {
    const { backgrounds } = this.props;
    return <SearchableList
      items={backgrounds}
      renderItem={this.renderBackground}
    />;
  }
}

export default connect(BackgroundsTab.mapStateToProps)(BackgroundsTab);