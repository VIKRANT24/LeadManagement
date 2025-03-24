import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { Link, useParams } from "react-router-dom";
import { getServices } from "../../../../../services/masterService";
import DataTable from "../../../../../Components/DataTable/DataTable";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Container,
  Row,
  Col,
} from "reactstrap";
import AddServices from "./AddServices";
import { getStatusColor } from "../../../../../utils/commonFunction";
import { formatDateTime } from "../../../../../utils/formatDateTime";

function Services({ newProjectId, projectRowData, cancle }, args) {
  const [serviceProjectId, setServiceProjectId] = useState(newProjectId);
  const [routeURL, SetrouteURL] = useState("add");
  const [servicesData, setServicesData] = useState([]);
  const [modal, setModal] = useState(false);
  const [hasFetched, setHasFetched] = useState(false); // To prevent multiple API calls
  const [selectedServiceId, setSelectedServiceId] = useState(null);

  // console.log("projectRowData", projectRowData);

  // Modified toggle function to accept the WhatsApp number
  const toggle = (id) => {
    if (typeof id !== "undefined") {
      setSelectedServiceId(id);
    }
    setModal((prev) => !prev);
  };

  const handleCancel = () => {
    // Clear the selected ID and close the modal
    setSelectedServiceId(null);
    setModal(false);
    setHasFetched(false); // Reset so that useEffect runs again
  };

  useEffect(() => {
    if (!hasFetched) {
      const fetchData = async () => {
        try {
          const response = await getServices(serviceProjectId); // Await the asynchronous call

          if (response.status === 200) {
            if (response?.data?.success) {
              // console.log("getServices", response?.data?.data?.services);

              setServicesData(response?.data?.data?.services);
              setHasFetched(true); // Set to true after the first fetch
            }
          } else {
            if (response?.status !== 404) {
              toast.error(
                response?.response?.data?.error?.message ||
                  "Failed to fetch services data."
              );
            }
          }
        } catch (error) {
          if (response?.status !== 404) {
            toast.error(
              "An error occurred while fetching services data. Please try again."
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
        Header: "Services",
        accessor: "serviceName",
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
        Header: "Action",
        accessor: "edit", // Dummy accessor for this column
        Cell: ({ row }) => (
          <div className="editIconContainer">
            <Link
              onClick={() => toggle(row.original.serviceId)}
              style={{ color: "#51cbce", cursor: "pointer" }}
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
              <strong>Project: </strong>
              {projectRowData?.projectName}
            </div>
            <div>
              <strong>Website: </strong>
              {projectRowData?.website}
            </div>
          </Col>
        </Row>
      </Container>
      <DataTable
        routeURL={"toggle"}
        tabletitle={"SERVICES"}
        columnsData={columnsData}
        tableData={servicesData}
        onAdd={toggle}
      />

      {/* Modal popup */}
      <div>
        <Modal isOpen={modal} {...args}>
          <ModalHeader toggle={handleCancel}></ModalHeader>
          <ModalBody>
            <AddServices
              selectedServiceId={selectedServiceId}
              newProjectId={projectRowData?.projectId}
              cancle={handleCancel}
            />
          </ModalBody>
        </Modal>
      </div>
    </>
  );
}

export default Services;
