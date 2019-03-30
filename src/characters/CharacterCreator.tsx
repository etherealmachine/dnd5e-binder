import "core-js/library";
import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';

import { State as AppState } from '../store';
import { CharacterState } from '../store';
import Compendium from '../compendium';

import SelectRace from './steps/SelectRace';
import SelectClass from './steps/SelectClass';
import SelectName from './steps/SelectName';
import SelectBackground from './steps/SelectBackground';
import AssignAbilityScores from './steps/AssignAbilityScores';
import ChooseProficiencies from './steps/ChooseProficiencies';
import SelectEquipment from './steps/SelectEquipment';
import SelectSpells from './steps/SelectSpells';
import CharacterCard from '../cards/CharacterCard';

export interface Props extends CharacterState {
    compendium: Compendium
    dispatch: Dispatch
    selectedCharacter: CharacterState
}

interface State extends Partial<CharacterState> {
    activeStep: number
}

class CharacterCreator extends React.Component<Props, State> {

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
            selectedCharacter: state.characters.characters[state.characters.selected],
        };
    }

    public static mapDispatchToProps(dispatch: Dispatch): Partial<Props> {
        return {
            dispatch: dispatch,
        };
    }

    private handleBack = () => {
        this.setState({
            activeStep: this.state.activeStep - 1,
        });
    }

    private handleNext = () => {
        this.setState({
            activeStep: this.state.activeStep + 1,
        });
    }

    public renderStep(step: Number): React.ReactNode {
        switch (step) {
            case 0:
                return <SelectRace />;
            case 1:
                return <SelectClass />;
            case 2:
                return <SelectName />;
            case 3:
                return <SelectBackground />;
            case 4:
                return <AssignAbilityScores />;
            case 5:
                return <ChooseProficiencies />;
            case 6:
                return <SelectEquipment />;
            case 7:
                return <SelectSpells />;
            default:
                return <div></div>;
        }
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
            <div style={{ display: 'flex', flexDirection: 'row' }}>
                <div style={{ display: 'flex', marginRight: '16px' }}>
                    <CharacterCard character={this.props.selectedCharacter}/>
                </div>
                <Card>
                    <CardContent>
                        {this.renderStep(this.state.activeStep)}
                    </CardContent>
                </Card>
            </div>
            <div>
                <Button disabled={this.state.activeStep === 0} onClick={this.handleBack}>Back</Button>
                <Button color="primary" onClick={this.handleNext}>Next</Button>
            </div>
        </div>;
    }
}

export default connect(CharacterCreator.mapStateToProps, CharacterCreator.mapDispatchToProps)(CharacterCreator);
