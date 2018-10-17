import "core-js/library";
import * as React from 'react';
import { withStyles } from '@material-ui/core/styles';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

const styles = {
  card: {
  	display: 'flex',
  	'flex-direction': 'column',
    maxWidth: 345,
    margin: 10,
    padding: 15,
  },
  media: {
  	'background-size': 'contain',
    height: 140,
  },
};

export interface Props {
  classes: { [key: string]: string }
  obj: any
}

class ObjectCard extends React.Component<Props> {

  public constructor(props: Props) {
    super(props);
  }

  private renderList = (key: string, value: any, i: number): (JSX.Element | null)[] => {
    return Object.values(value).map((v: any, j) => {
      if (v === null) {
        return null;
      }
      if (typeof(v) === 'object') {
        if (v.hasOwnProperty('name') && v.hasOwnProperty('text')) {
          return <Typography key={`${i}-${key}-${j}`}><span className='term'>{v.name}</span>: {v.text}</Typography>;
        }
        return <div key={`${i}-${key}-${j}`}>
          {this.renderList(key, v, j)}
        </div>;
      }
      return <Typography key={`${i}-${key}-${j}`}>{v}</Typography>;
    })
  }

  private renderFields = () => {
     return Object.entries(this.props.obj).map(([key, value], i) => {
       if (key === 'name' || value === null) {
         return null;
       }
       const name = key.charAt(0).toUpperCase() + key.slice(1);
       if (typeof(value) === 'string' || typeof(value) === 'number') {
         return <Typography key={`${i}-${key}`}><span className='term'>{name}</span>: {value}</Typography>;
       }
       if (value instanceof Array || typeof(value) === 'object') {
        if (!(value instanceof Array)) {
          value = [value];
        }
        return <div key={`${i}-${key}`}>
          <Typography variant="subtitle1">{name}</Typography>
          {this.renderList(key, value, i)}
        </div>;
       }
       return null;
     });
  }

  public render() {
  	return <Card className={this.props.classes.card}>
      <CardContent>
        <Typography variant="h6">{this.props.obj.name}</Typography>
        {this.renderFields()}
      </CardContent>
    </Card>;
  }
}

export default withStyles(styles)(ObjectCard);