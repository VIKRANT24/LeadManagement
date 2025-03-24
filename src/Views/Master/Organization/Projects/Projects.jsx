import React, { useEffect, useState } from "react";

import { ToastContainer, toast } from "react-toastify";
import { Link, useParams } from "react-router-dom";
import { getProjects } from "../../../../services/masterService";
import DataTable from "../../../../Components/DataTable/DataTable";
import { formatUrl, getStatusColor } from "../../../../utils/commonFunction";
import { formatDateTime } from "../../../../utils/formatDateTime";
import { Col, Container, Modal, ModalBody, ModalHeader, Row } from "reactstrap";
import AddProjects from "./AddProjects";
import Services from "./Services/Services";

function Projects({ selectedOrganizationId, organizationsRowData }, args) {
  const [organizationId, setOrganizationId] = useState(selectedOrganizationId);
  const [routeURL, SetrouteURL] = useState("add");
  const [projectData, setProjectsData] = useState([]);
  const [hasFetched, setHasFetched] = useState(false); // To prevent multiple API calls
  const [addModal, setAddModal] = useState(false);
  const [serviceModal, setServiceModal] = useState(false);
  const [projectId, setSelectedProjectId] = useState(null);
  const [projectRowData, setProjectRowData] = useState([]);
  //console.log("organizationsRowData", organizationsRowData);

  const toggle = (projectId) => {
    setSelectedProjectId(projectId);
    setAddModal((prev) => !prev);
  };

  const handleCancel = () => {
    setSelectedProjectId(null);
    setAddModal(false);
    //setLeadId(selectedLeadId);
    setHasFetched(false); // Reset so that useEffect runs again
  };

  const toggleService = (projectId, projectRowData) => {
    setSelectedProjectId(projectId);
    setProjectRowData(projectRowData);
    setServiceModal((prev) => !prev);
  };

  const handleServiceCancel = () => {
    setSelectedProjectId(null);
    setServiceModal(false);
    //setLeadId(selectedLeadId);
    setHasFetched(false); // Reset so that useEffect runs again
  };

  useEffect(() => {
    if (!hasFetched) {
      const fetchData = async () => {
        try {
          const response = await getProjects(organizationId); // Await the asynchronous call

          if (response.status === 200) {
            if (response?.data?.success) {
              setProjectsData(response?.data?.data?.projects);
              setHasFetched(true); // Set to true after the first fetch
            }
          } else {
            if (response?.status !== 404) {
              toast.error(
                response?.response?.data?.error?.message ||
                  "Failed to fetch projects data."
              );
            }
          }
        } catch (error) {
          if (response?.status !== 404) {
            toast.error(
              "An error occurred while fetching projects data. Please try again."
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
        Header: "Projects",
        accessor: "projectName",
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
        Header: "Services",
        accessor: "Services", // Dummy accessor for this column
        Cell: ({ row }) => (
          <div className="editIconContainer">
            <Link
              // to={`services/${row.original.projectId}`}
              onClick={() =>
                toggleService(row.original?.projectId, row.original)
              }
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
              onClick={() => toggle(row.original?.projectId)}
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
      <Container>
        <Row>
          <Col className="bg-light ptb" sm="4" xs="6">
            <div>
              <strong>Organization: </strong>
              {organizationsRowData?.organization}
            </div>
            <div>
              <strong>Website: </strong>
              {organizationsRowData?.website}
            </div>
          </Col>
        </Row>
      </Container>
      <DataTable
        routeURL={"toggle"}
        tabletitle={"PROJECTS"}
        columnsData={columnsData}
        tableData={projectData}
        onAdd={toggle}
      />

      {/* Modal Add/Edit popup */}
      <Modal
        isOpen={addModal}
        {...args}
        className="custom-modal"
        style={{ marginRight: "0px", marginTop: "0px", border: "none" }}
      >
        <ModalHeader toggle={handleCancel}></ModalHeader>
        <ModalBody>
          <AddProjects
            newOrganizationId={organizationsRowData?.organizationId}
            newProjectId={projectId}
            cancle={handleCancel}
          />
        </ModalBody>
      </Modal>

      {/* Modal Services popup */}
      <Modal
        isOpen={serviceModal}
        {...args}
        className="fullscreen"
        style={{ marginRight: "0px", marginTop: "0px", border: "none" }}
        fullscreen
      >
        <ModalHeader toggle={handleServiceCancel}></ModalHeader>
        <ModalBody>
          <Services
            newProjectId={projectId}
            projectRowData={projectRowData}
            cancle={handleServiceCancel}
          />
        </ModalBody>
      </Modal>
    </>
  );
}

export default Projects;
