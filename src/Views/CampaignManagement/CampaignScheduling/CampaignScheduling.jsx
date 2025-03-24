import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { Link, useParams } from "react-router-dom";
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
import { getCampScheduling } from "../../../services/campaignService";
import AddCampaignScheduling from "./AddCampaignScheduling";
import DataTable from "../../../Components/DataTable/DataTable";
import { formatDateTime } from "../../../utils/formatDateTime";
import { getStatusColor } from "../../../utils/commonFunction";

function CampaignScheduling(
  { selectedCampaignId, selectedCampaignRowData, cancle },
  args
) {
  const [campaignSchedulingData, setCampaignSchedulingData] = useState([]);
  const [hasFetched, setHasFetched] = useState(false); // To prevent multiple API calls
  const [campaignId, setCampaignId] = useState(selectedCampaignId);
  const [modal, setModal] = useState(false);
  const [campSchedulingId, setSelectedCampSchedulingId] = useState(null);

  // console.log("selectedCampaignRowData", selectedCampaignRowData);

  const toggle = (campSchedulingId) => {
    setSelectedCampSchedulingId(campSchedulingId);
    setModal((prev) => !prev);
  };

  const handleCancel = () => {
    setSelectedCampSchedulingId(null);
    setModal(false);
    setHasFetched(false); // Reset so that useEffect runs again
  };

  useEffect(() => {
    if (!hasFetched) {
      const fetchData = async () => {
        try {
          const response = await getCampScheduling(campaignId); // Await the asynchronous call

          if (response.status === 200) {
            if (response?.data?.success) {
              setCampaignSchedulingData(response?.data?.data?.schedulings); // Assuming  contains the roles data
              setHasFetched(true); // Set to true after the first fetch
              //  console.log("........", response?.data?.data?.schedulings);
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
      // {
      //   Header: "Campaign Id",
      //   accessor: "campaignId",
      // },
      {
        Header: "Template",
        accessor: "template.templateName",
      },
      {
        Header: "Send Type",
        accessor: "sendType",
      },
      {
        Header: "Scheduling Date",
        accessor: (row) => formatDateTime(row?.schedulingDate),
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
        accessor: (row) => formatDateTime(row?.createdDate),
      },
      {
        Header: "Action",
        accessor: "edit",
        Cell: ({ row }) => (
          <div className="editIconContainer">
            <Link
              onClick={() => toggle(row.original?.campSchedulingId)}
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
  // console.log("selectedCampaignRowData", selectedCampaignRowData);

  return (
    <>
      {/* Toast Container */}

      <Container>
        <Row>
          <Col className="bg-light ptb" sm="4" xs="6">
            <div>
              <strong>Campaign: </strong>
              {selectedCampaignRowData?.campaignName}
            </div>
            <div>
              <strong>Organization: </strong>
              {selectedCampaignRowData?.organization?.organization}
            </div>
            <div>
              <strong>Project: </strong>
              {selectedCampaignRowData?.project?.projectName}
            </div>
            <div>
              <strong>Service: </strong>
              {selectedCampaignRowData?.service?.serviceName}
            </div>
          </Col>
          <Col className="bg-light ptb" sm="4" xs="6">
            <div>
              <strong>Status: </strong>
              {selectedCampaignRowData?.status}
            </div>
            <div>
              <strong>Start Date: </strong>
              {formatDateTime(selectedCampaignRowData?.startDate)}
            </div>
            <div>
              <strong>End Date: </strong>
              {formatDateTime(selectedCampaignRowData?.endDate)}
            </div>
          </Col>
          <Col className="bg-light ptb" sm="4">
            <div>
              <strong>Assigned To: </strong>
              {`${selectedCampaignRowData?.assignedTo?.firstName || ""} ${
                selectedCampaignRowData?.assignedTo?.lastName || ""
              }`}
            </div>
            <div>
              <strong>Contact Tag Id: </strong>
              {selectedCampaignRowData?.contactTag?.tagName}
            </div>
            <div>
              <strong>Message Sender: </strong>
              {`${selectedCampaignRowData?.messageSender?.firstName || ""} ${
                selectedCampaignRowData?.messageSender?.lastName || ""
              }`}
            </div>
          </Col>
        </Row>
      </Container>
      <DataTable
        routeURL={"toggle"}
        tabletitle={"CAMPAIGN SCHEDULING"}
        columnsData={columnsData}
        tableData={campaignSchedulingData}
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
          <AddCampaignScheduling
            newCampSchedulingId={campSchedulingId}
            newCampaignId={selectedCampaignRowData?.campaignId}
            cancle={handleCancel}
          />
        </ModalBody>
      </Modal>
    </>
  );
}

export default CampaignScheduling;
