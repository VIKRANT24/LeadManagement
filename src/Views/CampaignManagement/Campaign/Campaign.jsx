import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import {
  Button,
  Card,
  CardBody,
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
import { Link } from "react-router-dom";
import {
  getCampaigns,
  getContactCampaigns,
} from "../../../services/campaignService";
import DatePicker from "react-datepicker";
import { format } from "date-fns"; // Import format function
import DataTable from "../../../Components/DataTable/DataTable";
import {
  getUserlists,
  getUserOrganizations,
} from "../../../services/masterService";
import { formatDateTime } from "../../../utils/formatDateTime";
import { getStatusColor } from "../../../utils/commonFunction";
import AddCampaign from "./AddCampaign";
import CampaignScheduling from "../CampaignScheduling/CampaignScheduling";

function Campaign(args) {
  const [routeURL, setRouteURL] = useState("");
  const [organizationMappingData, setOrganizationMappingData] = useState([]);
  const [selectedOrganizationId, setSelectedOrganizationId] = useState(null);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [modal, setModal] = useState(false);
  const [modalSchedul, setModalSchedul] = useState(false);
  const [campaignData, setCampaignData] = useState([]);
  const [selectedCampaignId, setSelectedCampaignId] = useState(null);
  const [selectedServiceId, setSelectedServiceId] = useState(null);
  const [userListsdata, setUserListsdata] = useState([]);
  const [contactTagData, setContactTagData] = useState([]);
  const [hasFetched, setHasFetched] = useState(false); // To prevent multiple API calls
  const [selectedCampaignRowData, setSelectedCampaignRowData] = useState([]);
  const toggle = (serviceId, campaignId) => {
    setSelectedCampaignId(campaignId);
    setSelectedServiceId(serviceId);

    setModal((prev) => !prev);
  };
  const currentDate = new Date(); // Current date for default selection

  const handleCancel = () => {
    setSelectedCampaignId(null);
    setModal(false);
    //setLeadId(selectedLeadId);
    setHasFetched(false); // Reset so that useEffect runs again
    if (selectedServiceId) {
      handleSubmit();
    }
  };

  const toggleSchedul = (campaignId, campaignRowData) => {
    // console.log("toggleSchedul called with:", campaignId, campaignRowData);
    if (typeof campaignId !== "undefined") {
      setSelectedCampaignId(campaignId);
      setSelectedCampaignRowData(campaignRowData);
    }
    setModalSchedul((prev) => !prev);
  };

  const handleSchedulCancel = () => {
    setSelectedCampaignId(null);
    setSelectedCampaignRowData(null);
    setModalSchedul(false);
  };

  useEffect(() => {
    if (!hasFetched) {
      if (selectedServiceId) {
        handleSubmit();
      }
    }
  }, [hasFetched]);

  const [inputdata, setInputData] = useState({
    organizationId: null,
    projectId: null,
    serviceId: null,
    assignedTo: null,
    contactTagId: null,
    startDate: null,
    endDate: null,
  });

  // console.log("campaignData", campaignData);

  const isFormValid = selectedOrganizationId !== null;

  const formatDate = (date) => {
    return date ? format(new Date(date), "yyyy-MM-dd") : "";
  };

  const handleDateChange = (dates) => {
    const [startDate, endDate] = dates;
    setInputData((prev) => ({
      ...prev,
      startDate: startDate ? startDate : null, // Ensure it's a valid date or null
      endDate: endDate ? endDate : null, // Ensure it's a valid date or null
    }));
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
      setSelectedProjectId(null);
      setInputData((prev) => ({ ...prev, projectId: null }));
      setFilteredServices([]);
    }
  }, [selectedOrganizationId, organizationMappingData]);

  useEffect(() => {
    if (selectedProjectId) {
      const selectedProj = filteredProjects.find(
        (proj) => proj.projectId === selectedProjectId
      );
      setFilteredServices(selectedProj ? selectedProj.services : []);
    }
  }, [selectedProjectId, filteredProjects]);

  // User List

  useEffect(() => {
    if (!hasFetched) {
      const fetchData = async () => {
        try {
          const response = await getUserlists(); // Await the asynchronous call

          if (response.status === 200) {
            if (response?.data?.success) {
              //console.log("Role Data", response?.data?.data?.role);
              const fetchedData = response?.data?.data?.users;
              setUserListsdata(fetchedData);
              setHasFetched(true); // Set to true after the first fetch
            }
          } else {
            toast.error(response?.data?.message || "Failed to fetch  data.");
          }
        } catch (error) {
          toast.error(
            "An error occurred while fetching  data. Please try again."
          );
          console.error("Error:", error);
        }
      };

      fetchData(); // Call the async function
    }
  }, [hasFetched]);

  //getContactCampaigns
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getContactCampaigns();
        if (response.status === 200 && response?.data?.success) {
          setContactTagData(response?.data?.data?.contactTags || []);
          setHasFetched(true);
        } else {
          toast.error(
            response?.response?.data?.error?.message || "Failed to fetch data."
          );
        }
      } catch (error) {
        toast.error("An error occurred while fetching data. Please try again.");
        console.error("Error:", error);
      }
    };

    if (!hasFetched) {
      fetchData();
    }
  }, [hasFetched]);

  //Submit Data

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   // Prepare the payload with only the selected data
  //   const payload = {
  //     organizationId: inputdata.organizationId, // Always include organizationId

  //     // Only include createdDate if there is at least one valid date
  //     ...((inputdata.startDate || inputdata.endDate) && {
  //       startDate: inputdata.startDate
  //         ? formatDate(inputdata.startDate)
  //         : undefined, // Do not include if empty or null
  //       endDate: inputdata.endDate ? formatDate(inputdata.endDate) : undefined, // Do not include if empty or null
  //     }),

  //     // Only include projectId if it's selected (not null or undefined)
  //     ...(inputdata.projectId && { projectId: inputdata.projectId }),

  //     // Only include serviceId if it's selected (not null or undefined)
  //     ...(inputdata.serviceId && { serviceId: inputdata.serviceId }),
  //     ...(inputdata.assignedTo && { assignedTo: inputdata.assignedTo }),
  //     ...(inputdata.contactTagId && { contactTagId: inputdata.contactTagId }),
  //   };

  //   // Remove any properties that are undefined
  //   Object.keys(payload).forEach(
  //     (key) => payload[key] === undefined && delete payload[key]
  //   );

  //   try {
  //     const response = await getCampaigns(payload);
  //     //  console.log("Response:", response); // Add this to inspect the response

  //     if (response.status === 200 && response?.data?.success) {
  //       setCampaignData(response?.data?.data?.campaigns || []);
  //       // console.log("leadsData", leadsData);
  //     } else {
  //       const errorMessage =
  //         response?.response?.data?.error?.message || "Failed to fetch data.";
  //       toast.error(errorMessage);
  //       setCampaignData([]);
  //     }
  //   } catch (error) {
  //     // toast.error("Error fetching data. Please try again.");
  //     console.error("Error:", error);
  //     setCampaignData([]);
  //   }
  // };

  const handleSubmit = async (e) => {
    if (e) {
      e.preventDefault();
    }

    // Prepare the payload with only the selected data
    const payload = {
      organizationId: inputdata.organizationId, // Always include organizationId

      // Only include createdDate if there is at least one valid date
      ...((inputdata.startDate || inputdata.endDate) && {
        startDate: inputdata.startDate
          ? formatDate(inputdata.startDate)
          : undefined,
        endDate: inputdata.endDate ? formatDate(inputdata.endDate) : undefined,
      }),

      // Only include projectId if it's selected (not null or undefined)
      ...(inputdata.projectId && { projectId: inputdata.projectId }),

      // Only include serviceId if it's selected (not null or undefined)
      ...(inputdata.serviceId && { serviceId: inputdata.serviceId }),
      ...(inputdata.assignedTo && { assignedTo: inputdata.assignedTo }),
      ...(inputdata.contactTagId && { contactTagId: inputdata.contactTagId }),
    };

    // Remove any properties that are undefined
    Object.keys(payload).forEach(
      (key) => payload[key] === undefined && delete payload[key]
    );

    try {
      const response = await getCampaigns(payload);

      if (response.status === 200 && response?.data?.success) {
        setCampaignData(response?.data?.data?.campaigns || []);
      } else {
        if (response?.status !== 404) {
          const errorMessage =
            response?.response?.data?.error?.message || "Failed to fetch data.";
          toast.error(errorMessage);
        }
        setCampaignData([]);
      }
    } catch (error) {
      if (error?.response?.status !== 404) {
        console.error("Error:", error);
        toast.error("An error occurred while fetching data.");
      }
      setCampaignData([]);
    }
  };

  const columnsData = React.useMemo(
    () => [
      {
        Header: "SR",
        accessor: "serialNumber",
        Cell: ({ row }) => row.index + 1,
      },
      {
        Header: "Campaign",
        accessor: "campaignName",
        Cell: ({ row }) => <span>{row.original?.campaignName || "-"}</span>,
      },
      {
        Header: "Description",
        accessor: "description",
        Cell: ({ row }) => <span>{row.original?.description || "-"}</span>,
      },
      {
        Header: "Service & Group Details",
        accessor: "serviceAndGroup",
        Cell: ({ row }) => (
          <div>
            <div>
              <i
                className="fa fa-cogs"
                style={{ marginRight: 5, color: "#D3D3D3" }}
              ></i>
              <strong>Service Name:</strong>{" "}
              {row.original?.service?.serviceName || "-"}
            </div>
            <div>
              <i
                className="fa fa-building"
                style={{ marginRight: 5, color: "#D3D3D3" }}
              ></i>
              <strong>Organization:</strong>{" "}
              {row.original?.organization?.organization || "-"}
            </div>
          </div>
        ),
      },
      {
        Header: "Group & Service Info",
        accessor: "groupInfo",
        Cell: ({ row }) => (
          <>
            <div>
              <i
                className="fa fa-user"
                style={{ marginRight: 5, color: "#D3D3D3" }}
              ></i>
              <strong>Assigned To:</strong>{" "}
              {`${row.original?.assignedTo?.firstName || "-"} ${
                row.original?.assignedTo?.lastName || ""
              }`}
            </div>
            <div>
              <i
                className="fa fa-tags"
                style={{ marginRight: 5, color: "#D3D3D3" }}
              ></i>
              <strong>Contact Tag:</strong>{" "}
              {row.original?.contactTag?.tagName || "-"}
            </div>
            <div>
              <i
                className="fa fa-paper-plane"
                style={{ marginRight: 5, color: "#D3D3D3" }}
              ></i>
              <strong>Message Sender:</strong>{" "}
              {`${row.original?.messageSender?.firstName || "-"} ${
                row.original?.messageSender?.lastName || ""
              }`}
            </div>
          </>
        ),
      },
      {
        Header: "Dates",
        accessor: "dates",
        Cell: ({ row }) => (
          <>
            <div>
              <strong>Start Date:</strong>{" "}
              {row.original?.startDate
                ? formatDateTime(row.original.startDate)
                : "-"}
            </div>
            <div>
              <strong>End Date:</strong>{" "}
              {row.original?.endDate
                ? formatDateTime(row.original.endDate)
                : "-"}
            </div>
          </>
        ),
      },
      {
        Header: "Created By",
        accessor: "createdBy",
        Cell: ({ row }) => (
          <>
            <div>
              <i
                className="fa fa-user-circle"
                style={{ marginRight: 5, color: "#D3D3D3" }}
              ></i>
              <strong>Created By:</strong>{" "}
              {`${row.original?.createdBy?.firstName || "-"} ${
                row.original?.createdBy?.lastName || ""
              }`}
            </div>
            <div>
              <i
                className="fa fa-calendar"
                style={{ marginRight: 5, color: "#D3D3D3" }}
              ></i>
              <strong>Created Date:</strong>{" "}
              {row.original?.createdDate
                ? formatDateTime(row.original.createdDate)
                : "-"}
            </div>
          </>
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
      {
        Header: "Action",
        accessor: "actions",
        Cell: ({ row }) => (
          <div
            className="editIconContainer"
            style={{ display: "flex", gap: "10px" }}
          >
            <Link
              onClick={(e) => {
                e.preventDefault();
                toggleSchedul(row.original.campaignId, row.original);
              }}
              // target="_blank"
              // rel="noopener noreferrer"
              style={{ color: "#51cbce", background: "#4ba6ed" }}
              className="editIcon"
            >
              <i
                className="fa fa-calendar"
                aria-hidden="true"
                style={{ cursor: "pointer", fontSize: "16px" }}
              ></i>
            </Link>

            <Link
              onClick={() =>
                toggle(
                  row.original?.service?.serviceId,
                  row.original.campaignId
                )
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
        ),
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
                            setSelectedProjectId(projectId);
                            setInputData((prev) => ({ ...prev, projectId }));
                          }}
                          className="form-control"
                          disabled={!selectedOrganizationId}
                        >
                          <option value="" disabled>
                            -- Select a project --
                          </option>
                          <option value="">None</option>
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

                    {/* Service Selection */}
                    <Col md="4">
                      <FormGroup>
                        <label>Select Services</label>
                        <Input
                          type="select"
                          name="serviceId"
                          value={inputdata.serviceId || ""}
                          onChange={(e) => {
                            const serviceId = parseInt(e.target.value, 10);
                            setInputData((prev) => ({ ...prev, serviceId }));
                          }}
                          className="form-control"
                          disabled={!selectedProjectId}
                        >
                          <option value="" disabled>
                            -- Select a service --
                          </option>
                          <option value="">None</option>
                          {filteredServices.map((service) => (
                            <option
                              key={service.serviceId}
                              value={service.serviceId}
                            >
                              {service.serviceName}
                            </option>
                          ))}
                        </Input>
                      </FormGroup>
                    </Col>
                    <Col md="4">
                      <FormGroup>
                        <label>Assigned To</label>
                        <Input
                          type="select"
                          name="assignedTo"
                          value={inputdata.assignedTo || ""}
                          onChange={(e) => {
                            const assignedTo = parseInt(e.target.value, 10);
                            setInputData((prev) => ({ ...prev, assignedTo }));
                          }}
                          className="form-control"
                          disabled={!selectedOrganizationId}
                        >
                          <option value="" disabled>
                            -- Select a assigned to --
                          </option>
                          <option value="">None</option>
                          {userListsdata.map((user) => (
                            <option key={user.userId} value={user.userId}>
                              {`${user.firstName} ${user.lastName}`}
                            </option>
                          ))}
                        </Input>
                      </FormGroup>
                    </Col>

                    <Col md="4">
                      <FormGroup>
                        <label>Contact Tag</label>
                        <Input
                          type="select"
                          name="contactTagId"
                          value={inputdata.contactTagId || ""}
                          onChange={(e) => {
                            const contactTagId = parseInt(e.target.value, 10);
                            setInputData((prev) => ({ ...prev, contactTagId }));
                          }}
                          className="form-control"
                          disabled={!selectedOrganizationId}
                        >
                          <option value="" disabled>
                            -- Select a contact tag --
                          </option>
                          <option value="">None</option>
                          {contactTagData.map((tag) => (
                            <option
                              key={tag.contactTagId}
                              value={tag.contactTagId}
                            >
                              {tag.tagName}
                            </option>
                          ))}
                        </Input>
                      </FormGroup>
                    </Col>

                    {/* Created Date Range */}
                    <Col md="4">
                      <FormGroup>
                        <label>Created Date Range</label>
                        <DatePicker
                          selected={inputdata.startDate || null}
                          onChange={(dates) => handleDateChange(dates)}
                          startDate={inputdata.startDate || null}
                          endDate={inputdata.endDate || null}
                          selectsRange
                          isClearable
                          dateFormat="yyyy-MM-dd"
                          placeholderText="Select Date Range"
                          className="form-control"
                          maxDate={currentDate} // Disable future dates
                          disabled={!selectedOrganizationId}
                        />
                      </FormGroup>
                    </Col>

                    {/* Submit Button */}

                    <Col
                      className="pl-1 d-flex justify-content-center align-items-center"
                      md="12"
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
          tabletitle={"CAMPAIGN"}
          columnsData={columnsData}
          tableData={campaignData}
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
            <AddCampaign
              newCampaignId={selectedCampaignId}
              newServiceId={selectedServiceId}
              cancle={handleCancel}
            />
          </ModalBody>
        </Modal>

        {/* Modal Followups popup */}
        <Modal
          isOpen={modalSchedul}
          {...args}
          className="fullscreen"
          style={{
            marginRight: "0px !important",
            marginTop: "0px !important",
            border: "none",
          }}
          fullscreen
        >
          <ModalHeader toggle={handleSchedulCancel}>
            {/* CAMPAIGN SCHEDULING */}
          </ModalHeader>
          <ModalBody>
            <CampaignScheduling
              selectedCampaignId={selectedCampaignId}
              selectedCampaignRowData={selectedCampaignRowData}
              cancle={handleSchedulCancel}
            />
          </ModalBody>
        </Modal>
      </div>
    </>
  );
}

export default Campaign;
