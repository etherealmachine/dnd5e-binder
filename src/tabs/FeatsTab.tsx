import * as React from 'react';

import Button from '@material-ui/core/Button';
import SearchableList from '../SearchableList';

export interface Props {
  feats: { [key: string]: any }
}

export default class FeatsTab extends React.Component<Props> {

  private renderFeat = (feat: any, index: number): JSX.Element => {
    let text = feat.text;
    if (!(text instanceof Array)) {
      text = [text];
    }
    return <div key={index}>
      <h2>{feat.name}</h2>
      <p><span className="term">Modifier: {feat.modifier}</span></p>
      <p>
        {(text as string[]).map((t, j) => <span key={j}>{t}<br /></span>)}
      </p>
      <Button color="primary">Add To Character</Button>
    </div>;
  }

  public render() {
    const { feats } = this.props;
    return <SearchableList
      items={feats}
      renderItem={this.renderFeat}
    />;
  }
}
