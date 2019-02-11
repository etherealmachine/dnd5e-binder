import "core-js/library";
import * as React from 'react';
import { connect } from 'react-redux';

import Button from '@material-ui/core/Button';
import { State as AppState } from './store';
import SearchableList from './SearchableList';

export interface Props {
  feats: { [key: string]: any }
}

class FeatsTab extends React.Component<Props> {

  public static mapStateToProps(state: AppState): Partial<Props> {
    return {
      feats: state.app.compendium.feats,
    };
  }

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

export default connect(FeatsTab.mapStateToProps)(FeatsTab);