import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { Link } from "react-router-dom";
import { getDesignations } from "../../../services/masterService";
import DataTable from "../../../Components/DataTable/DataTable";
import { getStatusColor } from "../../../utils/commonFunction";
import { formatDateTime } from "../../../utils/formatDateTime";

function Designation() {
  const [routeURL, SetrouteURL] = useState("add");
  const [tabletitle, SetTableTitleData] = useState({});
  const [designationsData, setDesignationsData] = useState([]);
  const [hasFetched, setHasFetched] = useState(false); // To prevent multiple API calls

  useEffect(() => {
    if (!hasFetched) {
      const fetchRoles = async () => {
        try {
          const response = await getDesignations(); // Await the asynchronous call

          if (response.status === 200) {
            if (response?.data?.success) {
              setDesignationsData(response?.data?.data?.designations); // Assuming `roles` contains the roles data
              setHasFetched(true); // Set to true after the first fetch
            }
          } else {
            if (response?.status !== 404) {
              toast.error(
                response?.response?.data?.error?.message ||
                  "Failed to fetch roles data."
              );
            }
          }
        } catch (error) {
          if (response?.status !== 404) {
            toast.error(
              "An error occurred while fetching roles data. Please try again."
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
        Header: "SR",
        accessor: (row, index) => index + 1, // Generates serial numbers dynamically
      },
      {
        Header: "Designations",
        accessor: "designation",
        Cell: ({ row }) => row.original.designation, // Render as a clickable link
      },
      // {
      //   Header: "Reporting Name",
      //   accessor: (row) => row.reportingRole?.roleName || "N/A",
      // },
      {
        Header: "Status",
        accessor: "status",
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
      // { Header: "Created By", accessor: "createdBy" },
      {
        Header: "Created Date",
        accessor: (row) => formatDateTime(row.createdDate),
      },
      {
        Header: "Action",
        accessor: "edit", // Dummy accessor for this column
        Cell: ({ row }) => (
          <div className="editIconContainer">
            <Link
              to={`${row.original.designationId}`}
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
        ), // Render FontAwesome edit icon inside a link
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
        tabletitle={"DESIGNATIONS"}
        columnsData={columnsData}
        tableData={designationsData}
      />
      ;
    </>
  );
}

export default Designation;
