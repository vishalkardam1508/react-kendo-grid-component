import * as React from "react";
import clsx from 'clsx'
import {useEffect, useRef, useState} from "react";
import {Checkbox, Fab, Grid, IconButton, Paper, Tooltip,TextField} from "@mui/material";
import Skeleton from "react-loading-skeleton";
import classNames from "classnames";
import Pagination from "./Pagination";
import {Table , TableContainer,TableRow,TableCell,TableHead,TableBody} from '@mui/material'
import {Cached,Delete,ExpandLess,ExpandMore,Add,Visibility} from "@mui/icons-material";
import { makeStyles } from '@mui/styles';
const useStyles = makeStyles({
    refreshButton: {
        width: '25px',
        height: '25px',
        // backgroundColor: theme.palette.primary.main,
        // color: theme.palette.primary.contrastText,
        '&:hover': {
            // backgroundColor: theme.palette.primary.dark,
        }
    },
    textField: {
        width: '150px',
        padding: "5px 10px",
        fontSize: '12px !important',
        // [theme.breakpoints.up('sm')]: {
        //     width: '250px',
        // }
    },
    fab: {
        position: "fixed",
        bottom: 62,
        right: 30,
        height: 40,
        width: 40
    },
    cell: {
        color: "inherit"
    },
    table: {
        fontSize: "90%"
    },
    row: {
        '&:hover': {
            // backgroundColor: theme.palette.primary[100]
        }
    },
    container: {
        maxHeight: 358,
    }
});
export default function TabularData(props) {
    const classes = useStyles(props);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState(props.sortBy);
    const [order, setOrder] = useState(props.order);
    const  theme = props.theme;
    const {getRow, createRow, headers: headersProp, total, selectedRows, onSelect, data, paginationPosition, search: showSearchBox} = props;
    const hasActions = props.editRow || props.deleteRow;
    const refreshData = async ({clear = false} = {}) => {
        if (!props.getData)
            return;
        if (clear)
            setLoading(true);
        await props.getData({page, limit, search, sortBy, order});
        setLoading(false);
    };
    useEffect(() => {
        refreshData({clear: true});
    }, [page, limit]);
    const didMountRef = useRef(false);
    useEffect(() => {
        if (didMountRef.current) {
            refreshData({clear: false});
        } else didMountRef.current = true
    }, [sortBy, order, search]);

    
        useEffect(() => {
            if (props.sortBy !== undefined)
            {
                setSortBy(props.sortBy);
            }
        }, [props?.sortBy]);

        useEffect(() => {
         if (props.order !== undefined)
             {
             setOrder(props.order);
        }
        }, [props?.order]);

        useEffect(() => {
          if (props.page !== undefined)
            setPage(props.page);
        }, [props?.page]);

        useEffect(() => {
         if (props.limit !== undefined)
            setLimit(props.limit);
        }, [props?.limit]);

    let rows = [];
    let headers = headersProp.map(header => {
        let object;
        if (typeof header === 'string') {
            object = {
                id: header,
                content: header
            };
        } else {
            object = header;
        }
        object = {
            width: `${100 / headersProp.length}%`,
            sortable: false,
            ...object
        };
        return object;
    });
    if (hasActions) {
        headers.push({
            id: "__actions",
            content: "Actions",
            width: "auto",
            sortable: false
        })
    }
    let headersCount = headers.length;
    if (selectedRows)
        headersCount++;
    rows = loading ? new Array(Number(limit)).fill(null).map(function (val, id) {
        return {
            id,
            cells: new Array(headersCount).fill(<Skeleton/>)
        }
    }) : data.map(object => {
        const row = getRow(object, () => {
        });

        if (selectedRows) {
            row.cells.unshift(<Checkbox
                color="primary"
                checked={selectedRows.includes(row.id)}
                onChange={e => {
                    const {checked} = e.target;
                    onSelect(checked ? [...selectedRows, row.id] : selectedRows.filter(id => id !== row.id));
                }}
            />)
        }
        if (hasActions) {
            const actions = <Grid container wrap="nowrap" alignItems="center">
                {
                    props.editRow &&
                    <Tooltip placement="top" title={"Edit"}>
                        <a href={'#'}
                            className="pl-2 pr-2 action pointer"
                            style={{color: theme.edit_button}}
                            onClick={() => props.editRow(object).then(() => refreshData())}>
                            <Visibility fontSize={'small'}/>
                        </a>
                    </Tooltip>
                }
                {
                    props.deleteRow &&
                    <Tooltip placement="top" title={"Delete"}>
                        <a href={'#'}
                            className="mx-2 action pointer"
                            style={{color: theme.delete_button}}
                            onClick={() => props.deleteRow(object).then(() => refreshData())}>
                            <Delete fontSize={'small'}/>
                        </a>
                    </Tooltip>
                }
                {row.actions && row.actions(refreshData)}
            </Grid>;
            row.cells.push(actions);
        }
        return row;
    });
    if (selectedRows) {
        headers.unshift({
            id: "__checkbox",
            content: <Checkbox
                color="primary"
                disabled={loading}
                checked={!!selectedRows.length && rows.every(row => selectedRows.includes(row.id))}
                onChange={e => {
                    const {checked} = e.target;
                    onSelect(checked ? rows.map(row => row.id) : []);
                }}
            />
        });
    }

    return <>
        <Grid container alignItems="center" className={clsx("p-2-all p-2")}>
            <Grid item xs style={{textAlign: 'center', verticalAlign: 'middle', color: theme.theme}}>
                {
                    props.title &&
                    <h3>{props.title}</h3>
                }
            </Grid>
            {
                showSearchBox &&
                <Grid className="w-auto" container wrap="nowrap">
                    {/*<label className={'pt-2'}>Search</label>*/}
                    <TextField  fullWidth inputProps={{style: {height:15},}}  value={search} onChange={(e) => setSearch(e.target.value)} size={'small'} name={'search'}
                               className={clsx(classes.textField,'pl-1')} id="outlined-basic"
                               placeholder="Search Here..." label="Search" />
                </Grid>
            }
            {/*Refresh-Button*/}
            <IconButton style={{background: theme.theme, color: theme.FONT_COLOR}}
                        classes={{
                            root: classes.refreshButton
                        }} onClick={() => refreshData()}>
                <Cached fontSize={'small'}/>
            </IconButton>
            {
                (paginationPosition === "top") &&
                <Pagination
                    theme={theme}
                    limit={limit} total={total} page={page}
                    onPageChange={setPage}
                    onLimitChange={setLimit}
                />
            }
        </Grid>
        <Paper elevation={5}>
        <TableContainer className={classes.container}>
            <Table stickyHeader size={'small'} className={classNames("table ", classes.table)}>
                {
                    !!headers.length &&
                    <TableHead style={{background:theme.theme,color:theme.FONT_COLOR}}>
                        <TableRow>
                            {
                                headers.map(({id, content, width, sortable}) => <TableCell
                                    style={{background:theme.theme,color:theme.FONT_COLOR,width:width}} key={id}
                                    className={classNames({
                                        pointer: sortable
                                    })}
                                    onClick={() => {
                                        sortable && setSortBy(id);
                                        if (sortBy === id)
                                            setOrder(prevOrder => prevOrder === "asc" ? "desc" : "asc")
                                    }}
                                >
                                    <Grid container alignItems="center" >
                                        {content}
                                        {
                                            sortBy === id &&
                                            <span className="pl-2">
                                                {
                                                    order === "asc" ?
                                                        <ExpandMore fontSize={'small'}/> :
                                                        <ExpandLess fontSize={'small'}/>
                                                }
                                        </span>
                                        }
                                    </Grid>
                                </TableCell>)
                            }
                        </TableRow>
                    </TableHead>
                }
                <TableBody>
                    {
                        rows.map(row => {
                            const {Component = "tr"} = row;
                            return <Component key={row.id} {...row.props}
                                              className={classNames(classes.row, row.props && row.props.className)}>
                                {
                                    row.cells.map((cell, index) => <TableCell className={classes.cell}
                                                                              key={index}>{cell}</TableCell>)
                                }
                            </Component>;
                        })
                    }
                    {
                        !rows.length && <TableRow>
                            <TableCell className="text-center" colSpan={headers.length}>No Records</TableCell>
                        </TableRow>
                    }
                </TableBody>
            </Table>
        </TableContainer>
        {
            (paginationPosition === "bottom-right" || paginationPosition === "bottom-left") &&
            <Grid container justify="center" alignItems="center">
                <Pagination
                    theme={theme}
                    limit={limit} total={total} page={page}
                    onPageChange={setPage}
                    onLimitChange={setLimit}
                />
            </Grid>
        }
        </Paper>
        {
            props.createRow &&
            <Fab
                style={{background: theme.theme, color: theme.FONT_COLOR}}
                className={classNames(classes.fab)}
                onClick={() => props.createRow().then(() => refreshData())}
            >
                <Add/>
            </Fab>
        }
    </>

}

TabularData.defaultProps = {
    paginationPosition: "bottom-right",
    order: "asc",
    headers: [],
    getRow: (row, id) => {
        return {
            id,
            cells: Object.values(row)
        }
    }
};
