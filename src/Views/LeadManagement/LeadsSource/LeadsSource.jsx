import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { Link } from "react-router-dom";
import DataTable from "../../../Components/DataTable/DataTable";
import { getLeadsSource } from "../../../services/leadService";
import { getStatusColor } from "../../../utils/commonFunction";
import { formatDateTime } from "../../../utils/formatDateTime";

function LeadsSource() {
  const [routeURL, SetrouteURL] = useState("add");
  const [leadSourceData, setLeadSourceData] = useState([]);
  const [hasFetched, setHasFetched] = useState(false); // To prevent multiple API calls

  useEffect(() => {
    if (!hasFetched) {
      const fetchRoles = async () => {
        try {
          const response = await getLeadsSource(); // Await the asynchronous call

          if (response.status === 200) {
            if (response?.data?.success) {
              setLeadSourceData(response?.data?.data?.leadSources); // Assuming `Leads Source` contains the roles data
              setHasFetched(true); // Set to true after the first fetch
            }
          } else {
            if (response?.status !== 404) {
              toast.error(
                response?.response?.data?.error?.message ||
                  "Failed to fetch leads source data."
              );
            }
          }
        } catch (error) {
          if (response?.status !== 404) {
            toast.error(
              "An error occurred while fetching leads source data. Please try again."
            );
            console.error("Error:", error);
          }
        }
      };

      fetchRoles(); // Call the async function
    }
  }, [hasFetched]); // Dependency ensures this runs only once

  const columnsData = React.useMemo(
    () => [
      {
        Header: "SR", // Serial Number
        accessor: (row, index) => index + 1, // Dynamically generated serial numbers
      },
      {
        Header: "Lead Source", // Display the leadSource
        accessor: "leadSource",
      },
      {
        Header: "Bg Color",
        accessor: "bgColor", // Display the status
        Cell: ({ value }) => (
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            {value ? (
              <>
                <div
                  style={{
                    backgroundColor: value,
                    width: "20px",
                    height: "20px",
                    border: "1px solid #ccc",
                  }}
                ></div>
                {value}
              </>
            ) : (
              "--"
            )}
          </div>
        ),
      },
      {
        Header: "Status",
        accessor: "status", // Display the status
        Cell: ({ value }) => (
          <span
            style={{
              backgroundColor: getStatusColor(value),
              color: "#fff",
              padding: "4px 8px",
              borderRadius: "4px",
              display: "inline-block",
              fontWeight: "bold",
              width: "100px",
              textAlign: "center",
            }}
          >
            {value}
          </span>
        ),
      },
      // {
      //   Header: "Created By",
      //   accessor: "createdBy", // Display who created the entry
      // },
      {
        Header: "Created Date",
        accessor: (row) => formatDateTime(row.createdDate),
      },
      {
        Header: "Action", // Edit action
        accessor: "edit", // Dummy accessor for this column
        Cell: ({ row }) => (
          <div className="editIconContainer">
            <Link
              to={`${row.original.leadSourceId}`}
              style={{ color: "#51cbce" }}
              className="editIcon"
            >
              <i
                className="fa fa-pencil-square-o"
                aria-hidden="true"
                style={{ cursor: "pointer", fontSize: "16px" }}
              ></i>
            </Link>
          </div>
        ),
      },
    ],
    []
  );

  return (
    <>
      {/* Toast Container */}
      <ToastContainer position="top-right" autoClose={1000} />
      <DataTable
        routeURL={routeURL}
        tabletitle={"LEADS SOURCE"}
        columnsData={columnsData}
        tableData={leadSourceData}
      />
      ;
    </>
  );
}

export default LeadsSource;
