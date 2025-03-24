import React from "react";
import { Table } from "reactstrap";

function ReuseTable({ data }) {
  if (!data || data.length === 0) return <p>No data available</p>;

  // Filter out any column that includes "id" (case-insensitive)
  const columns = Object.keys(data[0]).filter(
    (col) => !col.toLowerCase().includes("id")
  );

  return (
    <Table bordered striped className="reuseTable">
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={col} className="tableHeader">
              {col.replace(/([A-Z])/g, " $1").trim()}{" "}
              {/* Convert camelCase to readable text */}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, index) => (
          <tr key={index}>
            {columns.map((col) => (
              <td key={col}>
                <strong>{row[col]}</strong>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

export default ReuseTable;
