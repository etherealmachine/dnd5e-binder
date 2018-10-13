import "core-js/library";
import * as React from 'react';

class NumberInput extends React.Component<any> {

  public constructor(props: any) {
    super(props);
  }

  public render() {
  	const value = this.props.value === undefined || isNaN(this.props.value)? '' : this.props.value;
  	const min = this.props.min === undefined || isNaN(this.props.min)? '': this.props.min;
  	const max = this.props.max === undefined || isNaN(this.props.max)? '': this.props.max;
  	return <input {...this.props} value={value} min={min} max={max} />;
  }

}

export default NumberInput;