import "core-js/library";
import * as React from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';

import { Background } from './compendium';
import Button from '@material-ui/core/Button';
import { State as AppState } from './store';
import SearchableList from './SearchableList';

export interface Props {
  backgrounds: { [key: string]: Background }
  dispatch: Dispatch
}

class BackgroundsTab extends React.Component<Props> {

  public static mapStateToProps(state: AppState): Partial<Props> {
    return {
      backgrounds: state.app.compendium.backgrounds,
    };
  }

  public static mapDispatchToProps(dispatch: Dispatch): Partial<Props> {
    return { dispatch };
  }

  private handleAddToCharacter = (event: React.MouseEvent) => {
    this.props.dispatch({
      type: 'FIELD_CHANGE',
      key: 'background',
      value: event.currentTarget.getAttribute('data-background'),
    });
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
      <Button color="primary" data-background={background.name} onClick={this.handleAddToCharacter}>Add To Character</Button>
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