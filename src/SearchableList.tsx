import "core-js/library";
import * as React from 'react';
import { createStyles, WithStyles, withStyles } from '@material-ui/core/styles';

import TextField from '@material-ui/core/TextField';

export interface Props extends WithStyles<typeof styles> {
    items: { [key: string]: any }
    renderItem: (item: any, index: number) => JSX.Element
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
    list: {
        display: 'flex',
        flexDirection: 'column',
        flex: '1',
        marginBottom: '20px',
    },
});

class SearchableList extends React.Component<Props, State> {

    public constructor(props: Props) {
        super(props);
        this.state = {
            query: '',
        };
    }

    private handleSearchChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            query: event.currentTarget.value,
        });
    }

    public render() {
        const { classes, items, renderItem } = this.props;
        const { query } = this.state;
        const list = Object.values(items).filter((obj) => query === '' || obj.name.toLowerCase().includes(query.toLowerCase()));
        return <div className={classes.container}>
            <TextField
                label={`Search ${name}`}
                type="search"
                margin="normal"
                value={this.state.query}
                onChange={this.handleSearchChanged} />
            <div className={classes.list}>
                {list.map(renderItem)}
            </div>
        </div>;
    }
}

export default withStyles(styles)(SearchableList);