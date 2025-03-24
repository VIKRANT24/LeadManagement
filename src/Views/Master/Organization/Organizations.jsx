import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { Link } from "react-router-dom";
import { getOrganizations } from "../../../services/masterService";
import DataTable from "../../../Components/DataTable/DataTable";
import { getStatusColor, formatUrl } from "../../../utils/commonFunction";
import { formatDateTime } from "../../../utils/formatDateTime";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import Projects from "./Projects/Projects";

function Organizations(args) {
  const [routeURL, SetrouteURL] = useState("add");
  const [organizationsData, setOrganizationsData] = useState([]);
  const [hasFetched, setHasFetched] = useState(false); // To prevent multiple API calls
  const [modal, setModal] = useState(false);
  const [organizationId, setOrganizationId] = useState(null);
  const [organizationsRowData, setOrganizationsRowData] = useState([]);

  // Modified toggle function to accept the WhatsApp number
  const toggle = (organizationId, organizationsRowData) => {
    setOrganizationId(organizationId);
    setOrganizationsRowData(organizationsRowData);
    setModal((prev) => !prev);
  };

  const handleCancel = () => {
    // Clear the selected ID and close the modal
    // setSelectedProjectId(null);
    setOrganizationId(null);
    setModal(false);
    setHasFetched(false); // Reset so that useEffect runs again
  };

  useEffect(() => {
    if (!hasFetched) {
      const fetchData = async () => {
        try {
          const response = await getOrganizations(); // Await the asynchronous call

          if (response.status === 200) {
            if (response?.data?.success) {
              setOrganizationsData(response?.data?.data?.organizations);
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

      fetchData(); // Call the async function
    }
  }, [hasFetched]); // Dependency ensures this runs only once

  const columnsData = React.useMemo(
    () => [
      {
        Header: "SR",
        accessor: (row, index) => index + 1, // Generates serial numbers dynamically
      },
      {
        Header: "Organization",
        accessor: "organization",
      },
      {
        Header: "Website",
        accessor: "website",
        Cell: ({ row }) => {
          const formattedUrl = formatUrl(row.original.website);
          return (
            <a href={formattedUrl} target="_blank" rel="noopener noreferrer">
              {row.original.website}
            </a>
          );
        },
      },
      // {
      //   Header: "Logo",
      //   accessor: "logo",
      //   Cell: ({ row }) =>
      //     row.original.logo ? (
      //       <img
      //         src={row.original.logo}
      //         alt="Logo"
      //         style={{ width: "50px", height: "50px" }}
      //       />
      //     ) : (
      //       <span>No Logo</span> // Show a fallback text if logo is null
      //     ), // Display the logo as an image
      // },
      {
        Header: "Address",
        accessor: "address",
        Cell: ({ row }) => {
          const { address } = row.original;

          const addressParts = [
            address.address_line_1,
            address.address_line_2,
            address.city,
            address.state,
            address.country,
            address.pincode,
          ].filter(Boolean); // Remove undefined, null, or empty values

          return <div>{addressParts.join(", ")}</div>;
        },
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
      // {
      //   Header: "Created By",
      //   accessor: "createdBy",
      // },
      {
        Header: "Created Date",
        accessor: (row) => formatDateTime(row.createdDate),
      },
      {
        Header: "Projects",
        accessor: "project", // Dummy accessor for this column
        Cell: ({ row }) => (
          <div className="editIconContainer">
            <Link
              onClick={() => toggle(row.original?.organizationId, row.original)}
              style={{ color: "#51cbce" }}
              className="editIcon"
            >
              <i
                className="fa fa-eye"
                aria-hidden="true"
                style={{ cursor: "pointer", fontSize: "16px" }}
              ></i>
            </Link>
          </div>
        ), // Render FontAwesome edit icon inside a link
      },
      {
        Header: "Action",
        accessor: "edit", // Dummy accessor for this column
        Cell: ({ row }) => (
          <div className="editIconContainer">
            <Link
              to={`${row.original.organizationId}`}
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
        tabletitle={"ORGANIZATION"}
        columnsData={columnsData}
        tableData={organizationsData}
      />

      {/* Modal Projects popup */}
      <Modal
        isOpen={modal}
        {...args}
        className="fullscreen"
        style={{ marginRight: "0px", marginTop: "0px", border: "none" }}
        fullscreen
      >
        <ModalHeader toggle={handleCancel}></ModalHeader>
        <ModalBody>
          <Projects
            selectedOrganizationId={organizationId}
            organizationsRowData={organizationsRowData}
            cancle={handleCancel}
          />
        </ModalBody>
      </Modal>
    </>
  );
}

export default Organizations;
