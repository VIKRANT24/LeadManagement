import React, { useState, useEffect } from "react";
import jsonData from "../../Variables/tableData.js";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardTitle,
  Row,
  Col,
  Spinner,
} from "reactstrap";
import { useTable, usePagination, useGlobalFilter } from "react-table";
import { Navigate } from "react-router-dom";

function DataTable({ routeURL, tabletitle, columnsData, tableData, onAdd }) {
  const navigate = useNavigate();

  const handleAdd = (event) => {
    event.preventDefault(); // Prevent page reload
    // Pass data to the success page
    if (routeURL === "toggle" && onAdd) {
      onAdd();
    } else {
      navigate(routeURL || "/");
    }
  };

  // const tableDatas = tableData;
  const tableDatas = tableData;

  const columns = columnsData;
  // console.log("tableDatas", tableDatas);

  const [customPageSize, setCustomPageSize] = useState(10);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    state: { pageIndex },
    canPreviousPage,
    canNextPage,
    pageCount,
    gotoPage,
    setPageSize,
    setGlobalFilter,
  } = useTable(
    {
      columns,
      data: tableDatas,
      initialState: { pageSize: 10 },
    },
    useGlobalFilter,
    usePagination
  );

  useEffect(() => {
    setPageSize(customPageSize);
  }, [customPageSize, setPageSize]);

  const handlePageSizeChange = (e) => {
    setCustomPageSize(Number(e.target.value));
  };

  return (
    <div className="content">
      <Row>
        <Col md="12">
          <Card>
            <CardHeader className="data-table-header">
              <div className="header-left">
                <CardTitle tag="h5" className="text-capitalize">
                  {tabletitle}
                </CardTitle>
                <input
                  onChange={(e) => setGlobalFilter(e.target.value)}
                  placeholder="Search..."
                  className="search-input"
                />
              </div>
              {routeURL && ( // Show button only if routeURL exists
                <button onClick={handleAdd} className="right-button">
                  ADD {tabletitle}
                </button>
              )}
            </CardHeader>

            <CardBody>
              {/* {tabletitle !== "LEADS" &&
              tabletitle !== "LEADS STATUS" &&
              tabletitle !== "LEADS TAG" &&
              (!tableData || tableData.length === 0) ? (
                <div className="spinner">
                  <Spinner>Loading...</Spinner>
                </div>
              ) : ( */}
              <table
                {...getTableProps()}
                style={{ width: "100%", borderCollapse: "collapse" }}
              >
                <thead className="tableHead">
                  {headerGroups.map((headerGroup) => (
                    <tr
                      {...headerGroup.getHeaderGroupProps()}
                      key={headerGroup.id}
                    >
                      {headerGroup.headers.map((column) => (
                        <th
                          {...column.getHeaderProps()}
                          key={column.id}
                          style={{
                            padding: "10px",
                            border: "1px solid #ddd",
                            fontSize: "12px",
                          }}
                        >
                          {column.render("Header")}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody {...getTableBodyProps()} className="tableBody">
                  {page.length > 0 ? (
                    page.map((row) => {
                      prepareRow(row);
                      return (
                        <tr {...row.getRowProps()} key={row.id || row.index}>
                          {row.cells.map((cell) => (
                            <td
                              {...cell.getCellProps()}
                              key={`${row.id || row.index}-${cell.column.id}`}
                              style={{
                                padding: "5px",
                                border: "1px solid #ddd",
                              }}
                            >
                              {cell.render("Cell")}
                            </td>
                          ))}
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td
                        colSpan={columns.length}
                        style={{
                          textAlign: "center",
                          padding: "10px",
                          border: "1px solid #ddd",
                        }}
                      >
                        Data not available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              {/* )} */}
            </CardBody>
            <CardFooter>
              <div>
                <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
                  {"<<"}
                </button>
                <button
                  onClick={() => gotoPage(pageIndex - 1)}
                  disabled={!canPreviousPage}
                >
                  {"<"}
                </button>
                <button
                  onClick={() => gotoPage(pageIndex + 1)}
                  disabled={!canNextPage}
                >
                  {">"}
                </button>
                <button
                  onClick={() => gotoPage(pageCount - 1)}
                  disabled={!canNextPage}
                >
                  {">>"}
                </button>

                <span>
                  Page {pageIndex + 1} of {pageCount}
                </span>

                <select
                  value={customPageSize}
                  onChange={handlePageSizeChange}
                  style={{
                    marginLeft: "10px",
                    padding: "5px",
                  }}
                >
                  {[5, 10, 15, 20].map((size) => (
                    <option key={size} value={size}>
                      Show {size}
                    </option>
                  ))}
                </select>
              </div>
            </CardFooter>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default DataTable;
