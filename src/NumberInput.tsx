import "core-js/library";
import * as React from 'react';

class NumberInput extends React.Component<any> {

  public constructor(props: any) {
    super(props);
  }

  public render() {
  	const value = this.props.value === undefined || isNaN(this.props.value)? '' : this.props.value;
  	return <input {...this.props} value={value} />;
  }

}

export default NumberInput;