import React, { useState } from "react";
import { Grid, GridColumn, GridToolbar } from "@progress/kendo-react-grid";
import { GridPDFExport } from "@progress/kendo-react-pdf";
import { ExcelExport } from "@progress/kendo-react-excel-export";
import { IntlService } from "@progress/kendo-react-intl";
import { process } from "@progress/kendo-data-query";
import TreeComponent from "./TreeComponent";
import DropdownFilterCell from "./DropDownFilter";
const DATE_FORMAT = "yyyy-mm-d hh:mm:ss.SSS";

const intl = new IntlService("en");

const DetailComponent = (props) => {
  const dataItem = props.dataItem;
  return (
    <div>
      <TreeComponent data={dataItem.details} />
    </div>
  );
};

const TestTable2 = (props) => {
  const [toolbar, setToolBar] = useState(false);
  const {
    data,
    theme,
    headers,
    sorting,
    filter,
    grouping,
    columndrag,
    excelExort,
    pdfExport,
    pdfDataColumnExport,
    resize,
    height,
    title,
  } = props;

  const [dataState, setDataState] = React.useState({
    skip: 0,
    take: 10,
    sort: [],
    group: [],
  });

  const [dataResult, setDataResult] = React.useState(process(data, dataState));

  const dataStateChange = (event) => {
    setDataResult(process(data, event.dataState));
    setDataState(event.dataState);
  };

  // for date

  data.forEach((o) => {
    o.shippedDate = intl.parseDate(
      o.shippedDate ? o.shippedDate : "20/20/2020",
      DATE_FORMAT
    );
    o.orderDate = intl.parseDate(
      o.orderDate ? o.orderDate : "20/20/2020",
      DATE_FORMAT
    );
  });

  const expandChange = (event) => {
    const isExpanded =
      event.dataItem.expanded === undefined
        ? event.dataItem.aggregates
        : event.dataItem.expanded;
    event.dataItem.expanded = !isExpanded;
    setDataResult({ ...dataResult });
  };

  let _pdfExport;

  const exportExcel = () => {
    _export.save();
  };

  let _export;

  const exportPDF = () => {
    if (Array.isArray(pdfDataColumnExport)) {
      if (pdfDataColumnExport) {
        _pdfExport.save();
      } else {
        alert("No Data");
      }
    } else {
      alert("pdfDataColumnExport should be array");
    }
  };

  // filter DropDown
  const categories = Array.from(
    new Set(data.map((p) => (p.status ? p.status : "")))
  );

  const CategoryFilterCell = (props) => (
    <DropdownFilterCell
      {...props}
      data={categories}
      defaultItem={"Select category"}
    />
  );

  // status color change
  const cellWithBackGround = (props) => {
    const check = props.dataItem.status;
    if (check === "active" || check === "completed") {
      return (
        <td>
          <p
            style={{
              padding: "5px",
              background: theme.mainTheme ? theme.mainTheme : "green",
              color: theme.textColor ? theme.textColor : "#fff",
              textAlign: "center",
              borderRadius: 5,
            }}
          >
            {check}
          </p>
        </td>
      );
    } else if (check === "pending" || check === "inprogress") {
      return (
        <td>
          <p
            style={{
              padding: "5px",
              background: "#f8a100",
              color: theme.textColor ? theme.textColor : "#fff",
              textAlign: "center",
              borderRadius: 5,
            }}
          >
            {check}
          </p>
        </td>
      );
    }
    return (
      <td>
        <p
          style={{
            padding: "5px",
            background: "red",
            color: theme.textColor ? theme.textColor : "#fff",
            textAlign: "center",
            borderRadius: 5,
          }}
        >
          {check}
        </p>
      </td>
    );
  };

  React.useEffect(() => {
    if (excelExort || pdfExport || title) {
      setToolBar(true);
    }
  }, [props]);

  return (
    <>
      <div>
        <ExcelExport
          data={data}
          ref={(exporter) => {
            _export = exporter;
          }}
        >
          <Grid
            style={{ height: height ? height : "600px" }}
            resizable={resize ? true : false}
            sortable={sorting ? sorting : false}
            filterable={filter ? filter : false}
            groupable={grouping ? grouping : false}
            reorderable={columndrag ? columndrag : false}
            pageable={{
              buttonCount: 4,
              pageSizes: true,
            }}
            data={dataResult}
            {...dataState}
            onDataStateChange={dataStateChange}
            detail={DetailComponent}
            expandField="expanded"
            onExpandChange={expandChange}
          >
            {toolbar ? (
              <GridToolbar>
                <div className="d-flex justify-content-between  w-100">
                  <h4
                    className="px-2 font-weight-bold"
                    style={{
                      color: theme.mainTheme ? theme.mainTheme : "#000",
                    }}
                  >
                    {title}
                  </h4>
                  <div className="d-flex justify-content-end">
                    {excelExort ? (
                      <>
                        <button
                          style={{ backgroundColor: theme.mainTheme }}
                          title="Export to Excel"
                          className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-primary"
                          onClick={exportExcel}
                        >
                          Export to Excel
                        </button>
                        &nbsp;
                      </>
                    ) : (
                      <></>
                    )}
                    {pdfExport ? (
                      <>
                        <button
                          style={{ backgroundColor: theme.mainTheme }}
                          className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-primary"
                          onClick={() => {
                            exportPDF();
                          }}
                        >
                          Export to PDF
                        </button>
                      </>
                    ) : (
                      <></>
                    )}
                  </div>
                </div>
              </GridToolbar>
            ) : (
              ""
            )}

            {Array.isArray(headers) ? (
              headers.length ? (
                headers.map((value) => (
                  <GridColumn
                    locked={value.locked}
                    field={value.field_name}
                    filterable={value.filter}
                    title={value.column_title}
                    filter={value.filterType}
                    format="{0:D}"
                    filterCell={
                      value.filterType === "boolean"
                        ? CategoryFilterCell
                        : false
                    }
                    cell={
                      value.field_name === "status" ? cellWithBackGround : false
                    }
                    width={value.field_name === "status" ? "150px" : false}
                  />
                ))
              ) : (
                <GridColumn title="Headers are not Found" />
              )
            ) : (
              <GridColumn title="Headers are not Found" />
            )}
          </Grid>
        </ExcelExport>

        <GridPDFExport
          ref={(pdfDataColumnExport) => {
            _pdfExport = pdfDataColumnExport;
          }}
          margin="1cm"
        >
          {
            <Grid
              data={process(data, {
                skip: dataState.skip,
                take: dataState.take,
              })}
            >
              {Array.isArray(pdfDataColumnExport) ? (
                pdfDataColumnExport.map((value) => (
                  <GridColumn
                    field={value.field_name}
                    title={value.column_title}
                  />
                ))
              ) : (
                <></>
              )}
            </Grid>
          }
        </GridPDFExport>
      </div>
    </>
  );
};

export default TestTable2;
