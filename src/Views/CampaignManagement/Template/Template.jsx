import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { Link } from "react-router-dom";
import { getTemplate } from "../../../services/campaignService";
import { getStatusColor } from "../../../utils/commonFunction";
import { formatDateTime } from "../../../utils/formatDateTime";
import DataTable from "../../../Components/DataTable/DataTable";

function Template() {
  const [routeURL, setRouteURL] = useState("add");
  const [templateData, setTemplateData] = useState([]);
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getTemplate();
        if (response.status === 200 && response?.data?.success) {
          setTemplateData(response?.data?.data?.templates || []);
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
        Header: "Template Details",
        accessor: (row) => row,
        Cell: ({ value }) => (
          <div>
            <div>
              <strong>Template:</strong> {value.templateName || "--"}
            </div>
            <div>
              <strong>Organization:</strong>{" "}
              {value.organization.organization || "--"}
            </div>
            <div>
              <strong>Project:</strong> {value.project.projectName || "--"}
            </div>
            <div>
              <strong>Service:</strong> {value.service.serviceName || "--"}
            </div>
          </div>
        ),
      },
      {
        Header: "Type Details",
        accessor: (row) => row,
        Cell: ({ value }) => (
          <div>
            <div>
              <strong>Send Type:</strong> {value.sendType || "--"}
            </div>
            <div>
              <strong>Template Type:</strong> {value.templateType || "--"}
            </div>
            <div>
              <strong>Access Type:</strong> {value.accessType || "--"}
            </div>
          </div>
        ),
      },
      // {
      //   Header: "CC",
      //   accessor: "cc",
      //   Cell: ({ value }) => (value ? value.replace(/,\s*$/, "") : "--"),
      // },
      // {
      //   Header: "BCC",
      //   accessor: "bcc",
      //   Cell: ({ value }) => (value ? value.replace(/,\s*$/, "") : "--"),
      // },
      {
        Header: "Subject",
        accessor: "subject",
        Cell: ({ value }) => value || "--",
      },
      // {
      //   Header: "Signature Details",
      //   accessor: (row) => row,
      //   Cell: ({ value }) => (
      //     <div>
      //       <div>
      //         <strong>Type:</strong> {value.signatureType || "--"}
      //       </div>
      //       <div>
      //         <strong>Signature:</strong> {value.signature || "--"}
      //       </div>
      //     </div>
      //   ),
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
      {
        Header: "Created Date",
        accessor: "createdDate",
        Cell: ({ value }) => formatDateTime(value),
      },
      {
        Header: "Edit",
        accessor: "edit",
        Cell: ({ row }) => (
          <div className="editIconContainer">
            <Link
              to={`${row.original.templateId}`}
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
        tabletitle={"TEMPLATE"}
        columnsData={columnsData}
        tableData={templateData}
      />
    </>
  );
}

export default Template;
