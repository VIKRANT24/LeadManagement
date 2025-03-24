import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { Link } from "react-router-dom";

import DataTable from "../../../Components/DataTable/DataTable";
import { getContactCampaigns } from "../../../services/campaignService";
import { getStatusColor } from "../../../utils/commonFunction";
import { formatDateTime } from "../../../utils/formatDateTime";

function ContactTag() {
  const [routeURL, setRouteURL] = useState("add");
  const [contactTagData, setContactTagData] = useState([]);
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getContactCampaigns();
        if (response.status === 200 && response?.data?.success) {
          setContactTagData(response?.data?.data?.contactTags || []);
          setHasFetched(true);
        } else {
          if (response?.status !== 404) {
            toast.error(
              response?.response?.data?.error?.message ||
                "Failed to fetch data."
            );
          }
        }
      } catch (error) {
        if (response?.status !== 404) {
          toast.error(
            "An error occurred while fetching data. Please try again."
          );
          console.error("Error:", error);
        }
      }
    };

    if (!hasFetched) {
      fetchData();
    }
  }, [hasFetched]);

  const columnsData = React.useMemo(
    () => [
      {
        Header: "SR", // Serial Number
        accessor: (row, index) => index + 1,
      },
      {
        Header: "Tag Name",
        accessor: "tagName",
        Cell: ({ value }) => value || "--",
      },
      {
        Header: "Contacts",
        accessor: "contacts",
        Cell: ({ value }) => value || "--",
      },

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

      {
        Header: "Created Date",
        accessor: (row) => formatDateTime(row.createdDate),
      },

      {
        Header: "Edit",
        accessor: "edit",
        Cell: ({ row }) => (
          <div className="editIconContainer">
            <Link
              to={`${row.original.contactTagId}`}
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
      <ToastContainer position="top-right" autoClose={1000} />
      <DataTable
        routeURL={routeURL}
        tabletitle={"CONTACT TAGS"}
        columnsData={columnsData}
        tableData={contactTagData}
      />
    </>
  );
}

export default ContactTag;
