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
import { getLeadsTag } from "../../../services/leadService";
import { formatDateTime } from "../../../utils/formatDateTime";
import { getStatusColor } from "../../../utils/commonFunction";
import AddLeadsTag from "./AddLeadsTag";

function LeadsTag(args) {
  const [routeURL, setrouteURL] = useState("");
  const [leadsTagData, setLeadsTagsData] = useState([]);
  const [organizationMappingData, setOrganizationMappingData] = useState([]);
  const [selectedOrganizationId, setSelectedOrganizationId] = useState(null);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [selectedleadTagId, setSelectedleadTagId] = useState(null);
  const [hasFetched, setHasFetched] = useState(false); // To prevent multiple API calls
  const [modal, setModal] = useState(false);
  const [inputdata, setInputData] = useState({
    organizationId: null,
    projectId: null,
  });

  const isFormValid = inputdata.projectId !== null;

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputData((prev) => ({
      ...prev,
      [name]: parseInt(value, 10) || null, // Ensure projectId is always a number
    }));
  };

  // Modified toggle function to accept the WhatsApp number
  const toggle = (projectId, leadTagId) => {
    setSelectedProjectId(projectId);
    setSelectedleadTagId(leadTagId);

    setModal((prev) => !prev);
  };

  const handleCancel = () => {
    // Clear the selected ID and close the modal
    // setSelectedProjectId(null);
    setSelectedleadTagId(null);
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
    setInputData((prev) => ({
      ...prev,
      organizationId: orgId, // Update inputdata with selected organizationId
    }));
  };

  useEffect(() => {
    if (selectedOrganizationId) {
      const selectedOrg = organizationMappingData.find(
        (org) => org.organizationId === selectedOrganizationId
      );
      setFilteredProjects(selectedOrg ? selectedOrg.projects : []);
      setInputData((prev) => ({ ...prev, projectId: null }));
    }
  }, [selectedOrganizationId, organizationMappingData]);

  // Form submission handler
  const handleSubmit = async (e) => {
    if (e) e.preventDefault(); // Prevent default only if an event exists

    // Create a shallow copy and delete organizationId
    const payload = { ...inputdata };
    delete payload.organizationId;

    try {
      const response = await getLeadsTag(payload); // Use updated payload

      if (response.status === 200 && response?.data?.success) {
        setLeadsTagsData(response?.data?.data?.leadTags || []);
      } else {
        if (response?.status !== 404) {
          toast.error(
            response?.response?.data?.error?.message ||
              "Failed to fetch leads tag data."
          );
        }
        setLeadsTagsData([]);
      }
    } catch (error) {
      if (response?.status !== 404) {
        toast.error("Error fetching leads tag data. Please try again.");
        console.error("Error:", error);
      }
      setLeadsTagsData([]);
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
        Header: "Lead Tag",
        accessor: "leadTag",
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
                  toggle(row.original.projectId, row.original.leadTagId)
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
                          value={inputdata.projectId || ""}
                          onChange={(e) => {
                            const projectId = parseInt(e.target.value, 10);
                            setInputData((prev) => ({ ...prev, projectId }));
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
          tabletitle={"LEADS TAG"}
          columnsData={columnsData}
          tableData={leadsTagData}
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
          <AddLeadsTag
            selectedProjectId={selectedProjectId}
            selectedleadTagId={selectedleadTagId}
            cancle={handleCancel}
          />
        </ModalBody>
      </Modal>
    </>
  );
}

export default LeadsTag;
