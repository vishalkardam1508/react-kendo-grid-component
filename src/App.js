import React, { useState } from "react";
import "./App.css";
import Table from "./Components/TabularData";
import TestTable from "./Components/TestTable";
import { allData } from "./constants";
import orders from "./Testing/orders.json";
import TestTable2 from "./Testing/TestTable2";
import { Theme } from "./Theme/Theme";

function App() {
  const headers = {
    name: "Name",
    mobile: "Mobile",
    email: "Email",
    address: "Address",
    status: "Status",
  };

  const pdfDataExport = [
    { id: 1, column_title: "Customer Id", field_name: "customerID" },
    { id: 2, column_title: "Order Id", field_name: "orderID" },
    { id: 3, column_title: "Employee Id", field_name: "employeeID" },
    { id: 4, column_title: "Order Date", field_name: "orderDate" },
  ];
  const headerData = [
    {
      id: 1,
      column_title: "Customer Id",
      field_name: "customerID",
      filter: true,
      locked: false,
      filterType: "",
    },
    {
      id: 2,
      column_title: "Order Id",
      field_name: "orderID",
      filter: false,
      locked: false,
      filterType: "",
    },
    {
      id: 3,
      column_title: "Order Date",
      field_name: "orderDate",
      filter: false,
      locked: false,
      filterType: "date",
    },
    {
      id: 4,
      column_title: "Ship Name",
      field_name: "shipName",
      filter: false,
      locked: false,
      filterType: "",
    },
    {
      id: 5,
      column_title: "freight",
      field_name: "shippedDate",
      filter: false,
      locked: false,
      filterType: "date",
    },
    {
      id: 6,
      column_title: "Status",
      field_name: "status",
      filter: true,
      locked: false,
      filterType: "boolean",
    },
  ];
  const data = [];
  return (
    <div className="App">
      <h2 className="text-center py-3 font-weight-bold">Data table Title</h2>
      {/* <Table headers={headers} data={allData} theme={Theme} /> */}
      {/* <TestTable /> */}
      <div style={{ width: "100%" }}>
        <TestTable2
          theme={Theme}
          data={orders}
          // title="Table Title"
          headers={headerData}
          sorting={true}
          resize={true}
          filter={!true}
          grouping={!true}
          columndrag={true}
          excelExort={!true}
          pdfExport={!true}
          height={500}
          pdfDataColumnExport={pdfDataExport}
        />
      </div>
      {/* <TabularData /> */}
    </div>
  );
}

export default App;
