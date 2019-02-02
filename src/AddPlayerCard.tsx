import "core-js/library";
import * as React from 'react';
import { createStyles, WithStyles, withStyles } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Input from '@material-ui/core/Input';

import { store } from './store';

export interface Props extends WithStyles<typeof styles> {
}

interface LocalState {
  name: string
  initiative: number
}

const styles = createStyles({
  card: {
    width: 400,
    margin: '10px 20px',
    overflowY: 'auto',
  },
  action: {
    display: 'flex',
    flexDirection: 'column',
  },
  actionName: {
    fontWeight: 600,
  },
  h5InputParent: {
    width: '100%',
    marginBottom: '10px',
  },
  h5Input: {
    width: '100%',
    color: 'rgba(0, 0, 0, 0.87)',
    fontSize: '1.5rem',
    fontWeight: 400,
    lineHeight: '1.33',
    letterSpacing: '0em',
    paddingTop: '3px',
    marginBottom: '2.4px',
    padding: '0',
  },
  table: {
    textAlign: 'center',
  },
  numberInputParent: {
    maxWidth: '2em',
    alignSelf: 'center',
  },
});

class AddPlayerCard extends React.Component<Props, LocalState> {

  public constructor(props: Props) {
    super(props);
    this.state = {
    	name: '',
    	initiative: 0,
    };
  }

  private monsterInstance = () => {
    return {
    	id: this.state.name,
    	name: this.state.name,
    	initiative: this.state.initiative,
    };
  }

  public render() {
    const { classes } = this.props;
    const { name, initiative } = this.state;
    return <Card className={classes.card}>
      <CardContent>
        <Input
            autoFocus={true}
            value={name}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => this.setState({name: event.currentTarget.value})}
            className={classes.h5InputParent}
            classes={{input: classes.h5Input}}
        />
        <div className="row justify-content-space-around">
					<div className="column align-self-flex-end" style={{minWidth: '110px'}}>
				    <label htmlFor="initiative" className="align-self-center">Initiative</label>
				      <Input
				          name="initiative"
				          className={this.props.classes.numberInputParent}
			            onChange={(event: React.ChangeEvent<HTMLInputElement>) => this.setState({initiative: parseInt(event.currentTarget.value)})}
				          type={'number'}
				          value={initiative || ''}
				      />
			    </div>
        </div>
      </CardContent>
      <CardActions>
        <Button size="small" color="primary" onClick={() => {
        		store.dispatch({type: 'ADD_TO_ENCOUNTER', monster: this.monsterInstance()});
        		this.setState({name: '', initiative: 0});
        }}>
          Add to Encounter
        </Button>
      </CardActions>
    </Card>
  }
}

// connect is not working welll with type inference
interface PassedProps {
}

const component: () => React.Component<PassedProps> = (withStyles(styles)(AddPlayerCard) as any);
export default component;