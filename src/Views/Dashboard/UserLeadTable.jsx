import React from "react";
import { Table } from "reactstrap";

function UserLeadTable({ data }) {
  if (!data || data.length === 0) return <p>No data available</p>;

  return (
    <Table bordered striped>
      <thead>
        <tr>
          <th className="tableHeader">Full Name</th>
          <th className="tableHeader">Lead Count</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => (
          <tr key={index}>
            <td>
              <strong>
                {`${item.user.salutation ? item.user.salutation + " " : ""}${
                  item.user.firstName
                } ${item.user.lastName}`}
              </strong>
            </td>
            <td>
              <strong>{item.leadCount}</strong>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

export default UserLeadTable;
