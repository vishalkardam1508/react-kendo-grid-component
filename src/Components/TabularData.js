import React from "react";
import cloneDeep from "lodash/cloneDeep";
import throttle from "lodash/throttle";
import Pagination from "rc-pagination";
import "rc-pagination/assets/index.css";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import { pageLimit } from "../constants";
import { Edit, Add, Delete, RemoveRedEye } from "@mui/icons-material";
import { Fab, Paper, Tooltip, IconButton } from "@mui/material";
const Table = (props) => {
  const countPerPage = 3;
  const data = props?.data;
  const theme = props?.theme;
  const tableHead = props?.headers;
  const [value, setValue] = React.useState("");
  const [currentPage, setCurrentPage] = React.useState(1);
  const [limit, setLimit] = React.useState(countPerPage);
  const [status, setStatus] = React.useState("");
  const [collection, setCollection] = React.useState(
    cloneDeep(data.slice(0, limit))
  );
  const searchData = React.useRef(
    throttle((val) => {
      const query = val.toLowerCase();
      setCurrentPage(1);
      const data1 = cloneDeep(
        data
          .filter((item) => item.name.toLowerCase().indexOf(query) > -1)
          .slice(0, limit)
      );
      setCollection(data1);
    }, 400)
  );
  React.useEffect(() => {
    if (!value) {
      updatePage(1);
    } else {
      searchData.current(value);
    }
  }, [value, limit]);

  React.useEffect(() => {
    if (status !== "") {
      const data1 = data.filter((item) => item.status === status);
      console.log(data1);
      setCollection(data1);
    } else {
      setCollection(data);
      setLimit(limit);
    }
  }, [status]);

  const updatePage = (p) => {
    setCurrentPage(p);
    const to = limit * p;
    const from = to - limit;
    setCollection(cloneDeep(data.slice(from, to)));
  };

  const tableRows = (rowData) => {
    const { key, index } = rowData;
    const tableCell = Object.keys(tableHead);
    const columnData = tableCell.map((keyD, i) => {
      return (
        <>
          <td key={i}>{key[keyD]}</td>
        </>
      );
    });

    return (
      <tr key={index}>
        {columnData}
        <td>
          <Tooltip title="Edit">
            <IconButton
              onClick={() => {
                console.log(rowData);
              }}
              size="small"
            >
              <Edit fontSize="10" style={{ color: theme.editIcon }} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton
              onClick={() => {
                handleDelete(key);
              }}
              size="small"
            >
              <Delete fontSize="10" style={{ color: theme.deleteIcon }} />
            </IconButton>
          </Tooltip>
          <Tooltip title="View">
            <IconButton size="small">
              <RemoveRedEye fontSize="10" style={{ color: theme.viewIcon }} />
            </IconButton>
          </Tooltip>
        </td>
      </tr>
    );
  };

  const tableData = () => {
    return collection.map((key, index) => tableRows({ key, index }));
  };

  const headRow = () => {
    return Object.values(tableHead).map((title, index) => (
      <td key={index}>{title}</td>
    ));
  };

  function handleDelete(chipToDelete) {
    const newData = [...collection];
    const index = data.filter((item) => item.id === chipToDelete.id);
    newData.splice(index, 1);
    setCollection(newData);
  }

  return (
    <>
      <div className="TabularContainer">
        <Paper elevation={3} className={"paper-box"}>
          <div className="search">
            <input
              placeholder="Search Students"
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
            <TextField
              className="mx-2 input"
              select
              label="Status"
              value={status}
              onChange={(event) => {
                setStatus(event.target.value);
              }}
              size="small"
            >
              <MenuItem value={""}>All</MenuItem>
              <MenuItem value={"active"}>Active</MenuItem>
              <MenuItem value={"inactive"}>InActive</MenuItem>
            </TextField>
          </div>
          <table>
            <thead
              style={{
                backgroundColor: theme.mainTheme,
                color: theme.textColor,
              }}
            >
              <tr>
                {headRow()}
                <td>Actions</td>
              </tr>
            </thead>
            <tbody className="trhover">{tableData()}</tbody>
          </table>
          <div className="d-flex justify-content-between">
            <Pagination
              pageSize={limit}
              onChange={updatePage}
              current={currentPage}
              total={data.length}
            />
            <div>
              <label className="px-3">Select Page Limit</label>
              <TextField
                select
                variant="standard"
                value={limit}
                onChange={(event) => {
                  setLimit(event.target.value);
                }}
                size="small"
              >
                <MenuItem value={""}>Select</MenuItem>
                {pageLimit.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.value}
                  </MenuItem>
                ))}
              </TextField>
            </div>
          </div>
        </Paper>

        <Fab
          className="create-add-fab"
          color="primary"
          size="medium"
          aria-label="add"
        >
          <Add />
        </Fab>
      </div>
    </>
  );
};
export default Table;
