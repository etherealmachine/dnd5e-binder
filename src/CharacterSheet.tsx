import "core-js/library";
import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import Compendium from './compendium';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { CharacterState } from './store';
import { State as AppState } from './store';
import Typography from '@material-ui/core/Typography';

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

  public render() {
    return <div>
      <Card>
        <CardContent>
          <Typography variant="h5">Choose Class</Typography>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <Typography variant="h5">Choose Race</Typography>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <Typography variant="h5">Choose Background</Typography>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <Typography variant="h5">Assign Ability Scores</Typography>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <Typography variant="h5">Choose Proficiencies</Typography>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <Typography variant="h5">Buy Equipment</Typography>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <Typography variant="h5">Select Spells</Typography>
        </CardContent>
      </Card>
    </div>;
  }
}

export default connect(CharacterSheet.mapStateToProps, CharacterSheet.mapDispatchToProps)(CharacterSheet);
