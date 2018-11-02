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

class FeatsTab extends React.Component<Props, State> {

  public constructor(props: Props) {
    super(props);
    this.state = {
      query: '',
    };
  }

  public static mapStateToProps(state: AppState): Partial<Props> {
    return {
      compendium: state.app.compendium.feats,
    };
  }

  private handleSearchChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      query: event.currentTarget.value,
    });
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
    </div>;
  }

  public render() {
    const { classes, compendium } = this.props;
    const { query } = this.state;
    const list = Object.values(compendium).filter((obj) => query === '' || obj.name.toLowerCase().includes(query.toLowerCase()));
    return <div className={classes.container}>
      <TextField
          label="Search Feats"
          type="search"
          margin="normal"
          value={this.state.query}
          onChange={this.handleSearchChanged} />
      <div className={classes.table}>
        {list.map(this.renderFeat)}
      </div>
    </div>;
  }
}

export default connect(FeatsTab.mapStateToProps)(withStyles(styles)(FeatsTab));