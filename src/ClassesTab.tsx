import "core-js/library";
import * as React from 'react';
import { createStyles, WithStyles, withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';

import { State as AppState } from './store';
//import Button from '@material-ui/core/Button';
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
  featureName: {
    fontWeight: 600,
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
    console.log(clazz);
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
          <p key={content.length}><span className={this.props.classes.featureName}>{feature.name}:</span>&nbsp;{(text as string[]).map(t => <span>{t}<br /></span>)}</p>)
      });
    });
    return <div key={index}>
      <h2>{clazz.name}</h2>
      <p>Hit Die: {clazz.hd}</p>
      <p>Proficiency: {clazz.proficiency}</p>
      <p>{clazz.spellAbility && `Spell Ability: ${clazz.spellAbility}`}</p>
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