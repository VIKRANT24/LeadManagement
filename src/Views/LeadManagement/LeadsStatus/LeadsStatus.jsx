import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { Link } from "react-router-dom";
import DataTable from "../../../Components/DataTable/DataTable";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  FormGroup,
  Form,
  Input,
  Row,
  Col,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import {
  getProjects,
  getUserOrganizations,
} from "../../../services/masterService";
import { getLeadsStatus } from "../../../services/leadService";
import { formatDateTime } from "../../../utils/formatDateTime";
import { getStatusColor } from "../../../utils/commonFunction";
import AddLeadsStatus from "./AddLeadsStatus";

function LeadsStatus(args) {
  const [routeURL, setrouteURL] = useState("");
  const [leadsStatusData, setStatusData] = useState([]);
  const [organizationMappingData, setOrganizationMappingData] = useState([]);
  const [selectedOrganizationId, setSelectedOrganizationId] = useState(null);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [selectedleadStatusId, setSelectedleadStatusId] = useState(null);
  const [hasFetched, setHasFetched] = useState(false); // To prevent multiple API calls
  const [modal, setModal] = useState(false);
  const [inputData, setinputData] = useState({
    organizationId: null,
    projectId: null,
  });

  const isFormValid = inputData.projectId !== null;

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setinputData((prev) => ({
      ...prev,
      [name]: parseInt(value, 10) || null, // Ensure projectId is always a number
    }));
  };

  // Modified toggle function to accept the WhatsApp number
  const toggle = (projectId, leadStatusId) => {
    setSelectedProjectId(projectId);
    setSelectedleadStatusId(leadStatusId);

    setModal((prev) => !prev);
  };

  const handleCancel = () => {
    // Clear the selected ID and close the modal
    // setSelectedProjectId(null);
    setSelectedleadStatusId(null);
    setModal(false);
    setHasFetched(false); // Reset so that useEffect runs again
    // if (projectId) {
    handleSubmit();
    // }
  };

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const response = await getUserOrganizations();
        if (response.status === 200 && response?.data?.success) {
          setOrganizationMappingData(
            response?.data?.data?.organizationMapping || []
          );
        } else {
          if (response?.status !== 404) {
            toast.error(
              response?.response?.data?.error?.message ||
                "Failed to fetch organizations."
            );
          }
        }
      } catch (error) {
        if (response?.status !== 404) {
          toast.error("Error fetching organizations. Please try again.");
          console.error("Error:", error);
        }
      }
    };

    fetchOrganizations();
  }, []);

  const handleOrganizationChange = (e) => {
    const orgId = parseInt(e.target.value, 10);
    setSelectedOrganizationId(orgId);
    setinputData((prev) => ({
      ...prev,
      organizationId: orgId, // Update inputData with selected organizationId
    }));
  };

  useEffect(() => {
    if (selectedOrganizationId) {
      const selectedOrg = organizationMappingData.find(
        (org) => org.organizationId === selectedOrganizationId
      );
      setFilteredProjects(selectedOrg ? selectedOrg.projects : []);
      setinputData((prev) => ({ ...prev, projectId: null }));
    }
  }, [selectedOrganizationId, organizationMappingData]);

  // Form submission handler
  const handleSubmit = async (e) => {
    if (e) e.preventDefault(); // Prevent default only if an event exists
    const payload = { ...inputData };
    delete payload.organizationId;

    try {
      const response = await getLeadsStatus(payload); // Fixed missing `await`

      if (response.status === 200 && response?.data?.success) {
        setStatusData(response?.data?.data?.leadStatuses || []);
      } else {
        if (response?.status !== 404) {
          toast.error(
            response?.response?.data?.error?.message ||
              "Failed to fetch lead status data."
          );
        }
        setStatusData([]);
      }
    } catch (error) {
      if (response?.status !== 404) {
        toast.error("Error fetching lead status data. Please try again.");
        console.error("Error:", error);
      }
      setStatusData([]);
    }
  };

  // Table columns
  const columnsData = React.useMemo(
    () => [
      {
        Header: "SR",
        accessor: (row, index) => index + 1,
      },
      {
        Header: "Lead Status",
        accessor: "leadStatus",
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
        accessor: "edit",

        Cell: ({ row }) => {
          //    console.log("Row Data:", row.original); // Check if `projectId` and `leadTagId` exist
          return (
            <div className="editIconContainer">
              <Link
                onClick={() =>
                  toggle(row.original.projectId, row.original.leadStatusId)
                }
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
          );
        },
      },
    ],
    []
  );

  return (
    <>
      <div className="content">
        <ToastContainer position="top-right" autoClose={1000} />
        <Row>
          <Col md="12">
            <Card className="card-user">
              <CardBody>
                <Form className="mt-3">
                  <Row>
                    {/* Organization Selection */}
                    <Col md="4">
                      <FormGroup>
                        <label>Select Organization</label>
                        <Input
                          type="select"
                          name="organizationId"
                          value={selectedOrganizationId || ""}
                          onChange={handleOrganizationChange}
                          className="form-control"
                        >
                          <option value="" disabled>
                            -- Select an organization --
                          </option>
                          {organizationMappingData.map((org) => (
                            <option
                              key={org.organizationId}
                              value={org.organizationId}
                            >
                              {org.organization}
                            </option>
                          ))}
                        </Input>
                      </FormGroup>
                    </Col>

                    {/* Project Selection */}
                    <Col md="4">
                      <FormGroup>
                        <label>Select Project</label>
                        <Input
                          type="select"
                          name="projectId"
                          value={inputData.projectId || ""}
                          onChange={(e) => {
                            const projectId = parseInt(e.target.value, 10);
                            setinputData((prev) => ({ ...prev, projectId }));
                          }}
                          className="form-control"
                          disabled={!selectedOrganizationId}
                        >
                          <option value="" disabled>
                            -- Select a project --
                          </option>
                          {filteredProjects.map((project) => (
                            <option
                              key={project.projectId}
                              value={project.projectId}
                            >
                              {project.projectName}
                            </option>
                          ))}
                        </Input>
                      </FormGroup>
                    </Col>

                    {/* Submit Button */}

                    <Col
                      className="pl-1 d-flex justify-content-center align-items-center"
                      md="4"
                    >
                      <div className="update ml-auto mr-auto">
                        <Button
                          className="btn-round"
                          color="dark"
                          type="submit"
                          onClick={handleSubmit}
                          disabled={!isFormValid}
                        >
                          Submit
                        </Button>
                      </div>
                    </Col>
                  </Row>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <DataTable
          routeURL={"toggle"}
          tabletitle={"LEADS STATUS"}
          columnsData={columnsData}
          tableData={leadsStatusData}
          onAdd={toggle}
        />
      </div>

      {/* Modal Add/Edit popup */}
      <Modal
        isOpen={modal}
        {...args}
        className="custom-modal"
        style={{ marginRight: "0px", marginTop: "0px", border: "none" }}
      >
        <ModalHeader toggle={handleCancel}></ModalHeader>
        <ModalBody>
          <AddLeadsStatus
            selectedProjectId={selectedProjectId}
            selectedleadStatusId={selectedleadStatusId}
            cancle={handleCancel}
          />
        </ModalBody>
      </Modal>
    </>
  );
}

export default LeadsStatus;
