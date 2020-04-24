import * as React from 'react';

import { Background } from '../Compendium';
import SearchableList from '../SearchableList';

export interface Props {
  backgrounds: { [key: string]: Background }
}

export default class BackgroundsTab extends React.Component<Props> {

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
