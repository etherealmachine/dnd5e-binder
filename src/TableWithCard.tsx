import "core-js/library";
import * as React from 'react';
import ReactDOM from 'react-dom';
import { ArrowKeyStepper, AutoSizer, Table, ScrollIndices, SortDirection, SortDirectionType } from 'react-virtualized';
import { createStyles, WithStyles, withStyles } from '@material-ui/core/styles';

import TextField from '@material-ui/core/TextField';

export interface Props extends WithStyles<typeof styles> {
    name: string
    compare: (sortBy: string, sortDirection: SortDirectionType) => (a: any, b: any) => number
    renderItemCard: (item: any, handleCloseClicked: (event: React.MouseEvent) => void) => JSX.Element
    items: { [key: string]: any }
}

interface State {
    query: string,
    sortBy?: string,
    sortDirection?: SortDirectionType,
    scrollToRow?: number,
    selectedItemIndex?: number,
}

const styles = createStyles({
    container: {
        display: 'flex',
        flexDirection: 'column',
        flex: '1',
    },
    tableWithCard: {
        display: 'flex',
        flex: '1',
        marginBottom: '20px',
    },
    table: {
        flex: '1',
        overflow: 'hidden',
    },
    highlight: {
        boxSizing: 'border-box',
        borderBottom: '1px solid #e0e0e0',
        cursor: 'pointer',
        backgroundColor: '#a9e7ff'
    },
    row: {
        boxSizing: 'border-box',
        borderBottom: '1px solid #e0e0e0',
        cursor: 'pointer',
    },
    odd: {
        boxSizing: 'border-box',
        borderBottom: '1px solid #e0e0e0',
        backgroundColor: '#fafafa',
        cursor: 'pointer',
    },
});

class TableWithCard extends React.Component<Props, State> {

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

    private handleRowClick = ({ event, index, rowData }: { event: React.MouseEvent<any>, index: number, rowData: any }) => {
        this.setState({ selectedItemIndex: index, scrollToRow: index });
    }

    private handleCloseClicked = (event: React.MouseEvent<any>) => {
        this.setState({ selectedItemIndex: undefined });
    }

    private onScrollToChange = (params: ScrollIndices) => {
        if (this.tableRef.current !== null) {
            const node = ReactDOM.findDOMNode(this.tableRef.current.Grid)
            if (node instanceof HTMLElement) node.focus();
        }
        this.setState({ scrollToRow: params.scrollToRow });
    }

    private sort = ({ sortBy, sortDirection }: { sortBy?: string, sortDirection?: SortDirectionType }) => {
        const {
            sortDirection: prevSortDirection
        } = this.state;

        // If list was sorted DESC by this column.
        // Rather than switch to ASC, return to "natural" order.
        if (prevSortDirection === SortDirection.DESC) {
            sortBy = undefined;
            sortDirection = undefined;
        }

        this.setState({ sortBy, sortDirection });
    }

    private tableRef = React.createRef<Table>();

    public render() {
        const { classes, name, compare, renderItemCard, items, children } = this.props;
        const { query, sortBy, sortDirection, scrollToRow, selectedItemIndex } = this.state;
        const list = Object.values(items).filter((obj) => query === '' || obj.name.toLowerCase().includes(query.toLowerCase()));
        list.sort(compare(sortBy || 'name', sortDirection || SortDirection.ASC));
        return <div className={classes.container}>
            <TextField
                label={`Search ${name}`}
                type="search"
                margin="normal"
                value={this.state.query}
                onChange={this.handleSearchChanged} />
            <div className={classes.tableWithCard}>
                <div className={classes.table}>
                    <AutoSizer>
                        {({ height, width }) => (
                            <ArrowKeyStepper
                                isControlled={true}
                                onScrollToChange={this.onScrollToChange}
                                columnCount={1}
                                mode="cells"
                                rowCount={list.length}
                                scrollToRow={scrollToRow}>
                                {({ onSectionRendered, scrollToColumn, scrollToRow }: { onSectionRendered: any, scrollToColumn: number, scrollToRow: number }) => (
                                    <Table
                                        ref={this.tableRef}
                                        headerHeight={30}
                                        height={height}
                                        rowClassName={({ index }: { index: number }) => (scrollToRow === index ? classes.highlight : index % 2 == 0 ? classes.row : classes.odd)}
                                        noRowsRenderer={() => <div>No rows</div>}
                                        rowHeight={80}
                                        rowGetter={({ index }: { index: number }) => list[index]}
                                        rowCount={list.length}
                                        onSectionRendered={onSectionRendered}
                                        scrollToIndex={scrollToRow}
                                        onRowClick={this.handleRowClick}
                                        width={width}
                                        sort={this.sort}
                                        sortBy={sortBy}
                                        sortDirection={sortDirection}>
                                        {children}
                                    </Table>
                                )}
                            </ArrowKeyStepper>
                        )}
                    </AutoSizer>
                </div>
                {selectedItemIndex !== undefined && selectedItemIndex < list.length && renderItemCard(list[selectedItemIndex], this.handleCloseClicked)}
            </div>
        </div>;
    }
}

export default withStyles(styles)(TableWithCard);