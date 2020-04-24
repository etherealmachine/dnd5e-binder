import * as React from 'react';

import { Class } from '../Compendium';
import SearchableList from '../SearchableList';

import ClassCard from '../cards/ClassCard';


export interface Props {
  classes: { [key: string]: Class }
}

export default class ClassesTab extends React.Component<Props> {

  private renderClass = (clazz: any, index: number): JSX.Element => {
    return <ClassCard key={index} clazz={clazz} />;
  }

  public render() {
    const { classes } = this.props;
    return <SearchableList
      items={classes}
      renderItem={this.renderClass}
    />;
  }
}
