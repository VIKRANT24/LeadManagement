import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { Link, useParams } from "react-router-dom";
import { getFollowups } from "../../../../services/leadService";
import DataTable from "../../../../Components/DataTable/DataTable";
import { formatDateTime } from "../../../../utils/formatDateTime";
import {
  getStatusColor,
  getFollowupStatusColor,
} from "../../../../utils/commonFunction";
import {
  Col,
  Container,
  Row,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import AddFollowups from "./AddFollowups";

function Followups({ selectedLeadId, selectedLeadRowData, cancle }, args) {
  // console.log("selectedLeadRowData", selectedLeadRowData);

  const [routeURL, SetrouteURL] = useState("add");
  const [followupsData, setFollowupsData] = useState([]);
  const [hasFetched, setHasFetched] = useState(false); // To prevent multiple API calls
  const [leadId, setLeadId] = useState(selectedLeadId);
  const [modal, setModal] = useState(false);
  const [leadFollowupId, setSelectedLeadFollowupId] = useState(null);

  const toggle = (leadFollowupId) => {
    setSelectedLeadFollowupId(leadFollowupId);

    setModal((prev) => !prev);
  };

  const handleCancel = () => {
    setSelectedLeadFollowupId(null);
    setModal(false);
    //setLeadId(selectedLeadId);
    setHasFetched(false); // Reset so that useEffect runs again
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0]; // Extract YYYY-MM-DD
  };

  useEffect(() => {
    if (!hasFetched) {
      const fetchData = async () => {
        try {
          const response = await getFollowups(leadId); // Await the asynchronous call

          if (response.status === 200) {
            if (response?.data?.success) {
              setFollowupsData(response?.data?.data?.followups); // Assuming  contains the roles data
              setHasFetched(true); // Set to true after the first fetch
            }
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
              "An error occurred while fetching  data. Please try again."
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
        Header: "SR", // Serial Number
        accessor: (row, index) => index + 1, // Dynamically generated serial numbers
      },
      {
        Header: "Followup By",
        accessor: (row) => row.followupBy?.userName || "--", // Display the follow-up user's name
      },
      {
        Header: "Reporting Details",
        accessor: "reportingDetails", // Display reporting details
      },
      {
        Header: "Lead Status",
        accessor: (row) => row.leadStatus?.leadStatus || "--", // Display lead status
      },
      {
        Header: "Estimate Amount",
        accessor: (row) => row.amounts?.estimateAmount || "0", // Display estimate amount
      },
      {
        Header: "Closed Amount",
        accessor: (row) => row.amounts?.closedAmount || "0", // Display closed amount
      },
      {
        Header: "Next Follow-up Date",
        accessor: (row) =>
          row.nextFollowup?.date ? formatDate(row.nextFollowup.date) : "--",
      },
      {
        Header: "Next Follow-up Time",
        accessor: (row) => {
          const time = row.nextFollowup?.time;
          if (!time) return "--";

          // Convert "HH:mm:ss" to 12-hour format with AM/PM
          const [hours, minutes] = time.split(":");
          const hour = parseInt(hours, 10);
          const ampm = hour >= 12 ? "PM" : "AM";
          const formattedHour = hour % 12 || 12; // Convert 0 to 12 for 12-hour format

          return `${formattedHour}:${minutes} ${ampm}`;
        },
      },
      {
        Header: "Follow-up Status",
        accessor: "followupStatus", // Display follow-up status
        Cell: ({ value }) => (
          <span
            style={{
              backgroundColor: getFollowupStatusColor(value),
              color: "#fff",
              padding: "4px 8px",
              borderRadius: "4px",
              display: "inline-block",
              fontWeight: "bold",
            }}
          >
            {value}
          </span>
        ),
      },
      {
        Header: "Created By",
        accessor: (row) => row.createdBy?.userName || "--", // Display who created the entry
      },
      {
        Header: "Created Date",
        accessor: (row) => formatDateTime(row.createdDate),
      },
      {
        Header: "Action",
        accessor: "edit",
        Cell: ({ row }) => (
          <div className="editIconContainer">
            <Link
              onClick={() => toggle(row.original.leadFollowupId)}
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
      <Container>
        <Row>
          <Col className="bg-light ptb" sm="4" xs="6">
            <div>
              <strong>Organization: </strong>
              {selectedLeadRowData?.organization?.organization}
            </div>
            <div>
              <strong>Project: </strong>
              {selectedLeadRowData?.project?.projectName}
            </div>
            <div>
              <strong>Service: </strong>
              {selectedLeadRowData?.service?.serviceName}
            </div>
          </Col>
          <Col className="bg-light ptb" sm="4" xs="6">
            <div>
              <strong>Allocated To: </strong>
              {selectedLeadRowData?.allocatedTo?.userName}
            </div>
            <div>
              <strong>Lead Source: </strong>
              {selectedLeadRowData?.leadSource?.leadSource}
            </div>
            <div>
              <strong>Lead Tag: </strong>
              {selectedLeadRowData?.leadTag?.leadTag}
            </div>
          </Col>
          <Col className="bg-light ptb" sm="4">
            <div>
              <strong>Contact Name: </strong>
              {selectedLeadRowData?.contact?.contactName}
            </div>
            <div>
              <strong>Email Id: </strong>
              {selectedLeadRowData?.contact?.emailId}
            </div>
            <div>
              <strong>Mobile No: </strong>
              {selectedLeadRowData?.contact?.mobile?.countryCode}
              {selectedLeadRowData?.contact?.mobile?.mobileNumber}
            </div>
          </Col>
        </Row>
      </Container>
      <DataTable
        routeURL={"toggle"}
        tabletitle={"LEADS FOLLOWUPS"}
        columnsData={columnsData}
        tableData={followupsData}
        onAdd={toggle}
      />

      {/* Modal Add/Edit popup */}
      <Modal
        isOpen={modal}
        {...args}
        className="custom-modal"
        style={{ marginRight: "0px", marginTop: "0px", border: "none" }}
      >
        <ModalHeader toggle={handleCancel}></ModalHeader>
        <ModalBody>
          <AddFollowups
            newLeadId={leadId}
            newLeadFollowupId={leadFollowupId}
            newProjectId={selectedLeadRowData?.project?.projectId}
            cancle={handleCancel}
          />
        </ModalBody>
      </Modal>
    </>
  );
}

export default Followups;
