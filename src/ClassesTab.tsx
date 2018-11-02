import "core-js/library";
import * as React from 'react';
import { createStyles, WithStyles, withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';

import { State as AppState } from './store';
import TextField from '@material-ui/core/TextField';

export interface Props extends WithStyles<typeof styles> {
  compendium: { [key: string]: any }
}

interface State {
  query: string,
}

const styles = createStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    flex: '1',
  },
  table: {
    display: 'flex',
    flexDirection: 'column',
    flex: '1',
    marginBottom: '20px',
  },
});

interface Autolevel {
  slots?: string
  feature?: Feature | Feature[]
}

interface Feature {
  name: string
  text: string | string[]
}

class ClassesTab extends React.Component<Props, State> {

  public constructor(props: Props) {
    super(props);
    this.state = {
      query: '',
    };
  }

  public static mapStateToProps(state: AppState): Partial<Props> {
    return {
      compendium: state.app.compendium.classes,
    };
  }

  private handleSearchChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      query: event.currentTarget.value,
    });
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
    </div>;
  }

  public render() {
    const { classes, compendium } = this.props;
    const { query } = this.state;
    const list = Object.values(compendium).filter((obj) => query === '' || obj.name.toLowerCase().includes(query.toLowerCase()));
    return <div className={classes.container}>
      <TextField
          label="Search Classes"
          type="search"
          margin="normal"
          value={this.state.query}
          onChange={this.handleSearchChanged} />
      <div className={classes.table}>
        {list.map(this.renderClass)}
      </div>
    </div>;
  }
}

export default connect(ClassesTab.mapStateToProps)(withStyles(styles)(ClassesTab));