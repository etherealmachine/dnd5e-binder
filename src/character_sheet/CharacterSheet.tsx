import "core-js/library";
import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import Button from '@material-ui/core/Button';
import Compendium from '../compendium';
import { CharacterState } from '../store';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import { State as AppState } from '../store';

export interface Props extends CharacterState {
  compendium: Compendium
  dispatch: Dispatch
}

interface State extends Partial<CharacterState> {
  activeStep: number
}

class CharacterSheet extends React.Component<Props, State> {

  public constructor(props: Props) {
    super(props);
    const state = {
      activeStep: 0
    };
    Object.assign(state, props);
    this.state = state;
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

  private handleBack = () => {
    this.setState({
      activeStep: this.state.activeStep-1,
    });
  }

  private handleNext = () => {
    this.setState({
      activeStep: this.state.activeStep+1,
    });
  }

  public render() {
    return <div>
      <Stepper activeStep={this.state.activeStep}>
        <Step>
          <StepLabel>Race</StepLabel>
        </Step>
        <Step>
          <StepLabel>Class</StepLabel>
        </Step>
        <Step>
          <StepLabel>Name</StepLabel>
        </Step>
        <Step>
          <StepLabel>Background</StepLabel>
        </Step>
        <Step>
          <StepLabel>Ability Scores</StepLabel>
        </Step>
        <Step>
          <StepLabel>Proficiencies</StepLabel>
        </Step>
        <Step>
          <StepLabel>Equipment</StepLabel>
        </Step>
        <Step>
          <StepLabel>Spells</StepLabel>
        </Step>
      </Stepper>
      <Card>
        <CardContent></CardContent>
      </Card>
      <div>
        <Button disabled={this.state.activeStep === 0} onClick={this.handleBack}>Back</Button>
        <Button color="primary" onClick={this.handleNext}>Next</Button>
      </div>
    </div>;
  }
}

export default connect(CharacterSheet.mapStateToProps, CharacterSheet.mapDispatchToProps)(CharacterSheet);
