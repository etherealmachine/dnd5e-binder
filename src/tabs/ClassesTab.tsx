import "core-js/library";
import * as React from 'react';
import { connect } from 'react-redux';

import Button from '@material-ui/core/Button';
import { Class } from '../compendium';
import { State as AppState } from '../store';
import SearchableList from '../SearchableList';

export interface Props {
  classes: { [key: string]: Class }
}

interface Autolevel {
  slots?: string
  feature?: Feature | Feature[]
}

interface Feature {
  name: string
  text: string | string[]
}

class ClassesTab extends React.Component<Props> {

  public static mapStateToProps(state: AppState): Partial<Props> {
    return {
      classes: state.app.compendium.classes,
    };
  }

  private renderClass = (clazz: any, index: number): JSX.Element => {
    const content: JSX.Element[] = [];
    const autolevel = clazz.autolevel;
    autolevel.filter((level: Autolevel) => level.feature).forEach((level: Autolevel) => {
      let features = level.feature || [];
      if (!(features instanceof Array)) {
        features = [features];
      }
      features.forEach(feature => {
        let text = feature.text;
        if (!(feature.text instanceof Array)) {
          text = [feature.text];
        }
        content.push(
          <p key={content.length}><span className="term">{feature.name}:</span>&nbsp;{(text as string[]).map((t, j) => <span key={j}>{t}<br /></span>)}</p>)
      });
    });
    return <div key={index}>
      <h2>{clazz.name}</h2>
      <p><span className="term">Hit Die: {clazz.hd}</span></p>
      <p><span className="term">Proficiency: {clazz.proficiency}</span></p>
      <p>{clazz.spellAbility && <span><span className="term">Spell Ability:</span>{clazz.spellAbility}</span>}</p>
      {content}
      <Button color="primary">Add To Character</Button>
    </div>;
  }

  public render() {
    const { classes } = this.props;
    return <SearchableList
      items={classes}
      renderItem={this.renderClass}
    />;
  }
}

export default connect(ClassesTab.mapStateToProps)(ClassesTab);