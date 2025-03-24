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
import {
  getUserlists,
  getUserOrganizations,
} from "../../../services/masterService";
import DatePicker from "react-datepicker";
import { format } from "date-fns"; // Import format function
import { getLeadsSearch } from "../../../services/leadService";
import DataTable from "../../../Components/DataTable/DataTable";
import { Link } from "react-router-dom";
import { formatDateTime } from "../../../utils/formatDateTime";
import Transfer from "./Transfer";
import WhatsAppModal from "../../../Components/WhatsApp/WhatsAppModal";
import Followups from "./Followups/Followups";

function Leads(args) {
  const [routeURL, setRouteURL] = useState("");
  const [organizationMappingData, setOrganizationMappingData] = useState([]);
  const [selectedOrganizationId, setSelectedOrganizationId] = useState(null);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [userListsdata, setUserListsdata] = useState([]);
  const [hasFetched, setHasFetched] = useState(false);
  const [leadsData, setLeadsData] = useState([]);
  const [modal, setModal] = useState(false);
  const [modalToggle, setModalToggle] = useState(false);
  const [modalFollwups, setModalFollwups] = useState(false);
  const [selectedLeadId, setSelectedLeadId] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedLeadRowData, setSelectedLeadRowData] = useState([]);
  const [selectedWhatsAppNumber, setSelectedWhatsAppNumber] = useState(null);

  const toggle = (number) => {
    setSelectedWhatsAppNumber(number);
    setModalToggle(!modalToggle);
  };

  const toggleTransfer = (leadId, userId) => {
    if (typeof leadId !== "undefined") {
      setSelectedLeadId(leadId);
      setSelectedUserId(userId);
    }
    setModal((prev) => !prev);
  };

  const toggleFollwups = (leadId, leadRowData) => {
    if (typeof leadId !== "undefined") {
      setSelectedLeadId(leadId);
      setSelectedLeadRowData(leadRowData);
    }
    setModalFollwups((prev) => !prev);
  };

  const handleFollwupsCancel = () => {
    setSelectedLeadId(null);
    setSelectedLeadRowData(null);
    setModalFollwups(false);
    setHasFetched(false); // Reset so that useEffect runs again
    handleSubmit();
  };

  const handleCancel = () => {
    // Clear the selected ID and close the modal
    setSelectedLeadId(null);
    setSelectedUserId(null);
    setModal(false);
    setHasFetched(false); // Reset so that useEffect runs again
    handleSubmit();
  };

  const [inputdata, setInputData] = useState({
    organizationId: null,
    projectId: null,
    serviceId: null,
    leadSourceId: null,
    leadTagId: null,
    allocatedTo: null,
    contactId: null,
    referenceId: null,
    leadStatusId: null,
    createdDate: {
      fromDate: null, // Can be null for blank
      toDate: null, // Can be null for blank
    },
    nextFollowup: {
      fromDate: null, // Can be null for blank
      toDate: null, // Can be null for blank
    },
  });

  const isFormValid = selectedOrganizationId !== null;

  // const handleInputChange = (e) => {
  //   const { name, value } = e.target;
  //   setInputData((prev) => ({
  //     ...prev,
  //     [name]: value ? parseInt(value, 10) : null, // Ensure number conversion
  //   }));
  // };

  const formatDate = (date) => {
    return date ? format(new Date(date), "yyyy-MM-dd") : "";
  };

  const handleDateChange = (dates, fieldName) => {
    const [startDate, endDate] = dates;
    setInputData((prev) => ({
      ...prev,
      [fieldName]: {
        fromDate: startDate ? startDate : null, // Ensure it's a valid date or null
        toDate: endDate ? endDate : null, // Ensure it's a valid date or null
      },
    }));
  };

  useEffect(() => {
    setRouteURL(`add`);
  }, [selectedOrganizationId]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare the payload with only the selected data
    const payload = {
      organizationId: inputdata.organizationId, // Always include organizationId

      // Only include createdDate if there is at least one valid date
      ...((inputdata.createdDate.fromDate || inputdata.createdDate.toDate) && {
        createdDate: {
          fromDate: inputdata.createdDate.fromDate
            ? formatDate(inputdata.createdDate.fromDate)
            : undefined, // Do not include if empty or null
          toDate: inputdata.createdDate.toDate
            ? formatDate(inputdata.createdDate.toDate)
            : undefined, // Do not include if empty or null
        },
      }),

      // Only include nextFollowup if there is at least one valid date
      ...((inputdata.nextFollowup.fromDate ||
        inputdata.nextFollowup.toDate) && {
        nextFollowup: {
          fromDate: inputdata.nextFollowup.fromDate
            ? formatDate(inputdata.nextFollowup.fromDate)
            : undefined, // Do not include if empty or null
          toDate: inputdata.nextFollowup.toDate
            ? formatDate(inputdata.nextFollowup.toDate)
            : undefined, // Do not include if empty or null
        },
      }),

      // Only include projectId if it's selected (not null or undefined)
      ...(inputdata.projectId && { projectId: inputdata.projectId }),

      // Only include serviceId if it's selected (not null or undefined)
      ...(inputdata.serviceId && { serviceId: inputdata.serviceId }),
      ...(inputdata.allocatedTo && { allocatedTo: inputdata.allocatedTo }),
    };

    // Remove any properties that are undefined
    Object.keys(payload).forEach(
      (key) => payload[key] === undefined && delete payload[key]
    );

    try {
      const response = await getLeadsSearch(payload);
      //  console.log("Response:", response); // Add this to inspect the response

      if (response.status === 200 && response?.data?.success) {
        setLeadsData(response?.data?.data?.leads || []);
        // console.log("leadsData", leadsData);
      } else {
        if (response?.status !== 404) {
          const errorMessage =
            response?.response?.data?.error?.message || "Failed to fetch data.";
          toast.error(errorMessage);
        }
        setStatusData([]);
      }
    } catch (error) {
      if (response?.status !== 404) {
        // toast.error("Error fetching data. Please try again.");
        console.error("Error:", error);
      }
      setLeadsData([]);
    }
  };

  const currentDate = new Date(); // Current date for default selection

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

  // Table columns
  const columnsData = React.useMemo(
    () => [
      {
        Header: "SR",
        accessor: (row, index) => index + 1,
      },
      {
        Header: "Details",
        accessor: "organization",
        Cell: ({ row }) => (
          <div>
            <div>
              <i
                className="fa fa-building"
                style={{ marginRight: 5, color: "#D3D3D3" }}
              ></i>
              <strong>{row.original.organization.organization}</strong>
            </div>
            <div>
              <i
                className="fa fa-folder"
                style={{ marginRight: 5, color: "#D3D3D3" }}
              ></i>
              {row.original.project.projectName}
            </div>
            <div>
              <i
                className="fa fa-cogs"
                style={{ marginRight: 5, color: "#D3D3D3" }}
              ></i>
              {row.original.service.serviceName}
            </div>
          </div>
        ),
      },
      {
        Header: "Lead Info",
        accessor: "leadSource",
        Cell: ({ row }) => (
          <div>
            <div>
              <i
                className="fa fa-external-link-square"
                style={{ marginRight: 5, color: "#D3D3D3" }}
              ></i>
              {row.original.leadSource.leadSource}
            </div>
            <div>
              <i
                className="fa fa-tags"
                style={{ marginRight: 5, color: "#D3D3D3" }}
              ></i>
              {row.original.leadTag.leadTag}
            </div>
          </div>
        ),
      },
      {
        Header: "Contact",
        accessor: "contact",
        Cell: ({ row }) => {
          const { contact } = row.original;

          const countryCode =
            contact.mobile.countryCode && contact.mobile.countryCode !== "0"
              ? `${contact.mobile.countryCode}`
              : "";
          const mobile =
            contact.mobile.mobileNumber && contact.mobile.mobileNumber !== "0"
              ? contact.mobile.mobileNumber
              : "--";
          const whatsCode =
            contact.whatsApp.countryCode && contact.whatsApp.countryCode !== "0"
              ? `${contact.whatsApp.countryCode}`
              : "";
          const whatsapp =
            contact.whatsApp.whatsAppNumber &&
            contact.whatsApp.whatsAppNumber !== "0"
              ? contact.whatsApp.whatsAppNumber
              : "--";

          return (
            <div>
              <div>
                <i
                  className="fa fa-user"
                  style={{ marginRight: 5, color: "#D3D3D3" }}
                ></i>
                <strong>{contact.contactName}</strong>
              </div>
              <div>
                <i
                  className="fa fa-envelope"
                  style={{ marginRight: 5, color: "#D3D3D3" }}
                ></i>
                {contact.emailId}
              </div>
              <div>
                <i
                  className="fa fa-phone"
                  style={{ marginRight: 5, color: "#D3D3D3" }}
                ></i>
                {mobile !== "--" ? (
                  <span>
                    {countryCode && <>{countryCode} </>}
                    {mobile}
                  </span>
                ) : (
                  "--"
                )}
              </div>
              <div>
                <i
                  className="fab fa-whatsapp"
                  style={{ marginRight: 5, color: "green" }}
                ></i>
                {whatsapp !== "--" ? (
                  <Link
                    onClick={() => toggle(`${whatsCode}${whatsapp}`)}
                    style={{ color: "#25D366" }}
                  >
                    {whatsCode && <>{whatsCode} </>}
                    {whatsapp}
                  </Link>
                ) : (
                  "--"
                )}
              </div>
            </div>
          );
        },
      },
      {
        Header: "Next Followup",
        accessor: (row) => {
          const { date, time } = row.dates?.nextFollowup || {};
          if (date && time) {
            const formattedDate = new Date(date).toLocaleDateString("en-CA"); // YYYY-MM-DD
            const formattedTime = new Date(
              `1970-01-01T${time}`
            ).toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true, // AM/PM format
            });

            return `${formattedDate} ${formattedTime}`;
          }
          return "--";
        },
      },
      {
        Header: "Created Date",
        accessor: (row) => formatDateTime(row.dates.createdDate),
      },
      {
        Header: "Allocated To",
        accessor: (row) => row.allocatedTo.userName || "Not Allocated",
      },
      {
        Header: "Lead Status",
        accessor: (row) => row.leadStatus.leadStatus,
      },
      {
        Header: "Action",
        accessor: "actions",
        Cell: ({ row }) => (
          <div
            className="editIconContainer"
            style={{ display: "flex", gap: "10px" }}
          >
            {/* Follow-ups */}
            <Link
              onClick={(e) => {
                e.preventDefault();
                toggleFollwups(row.original.leadId, row.original);
              }}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#51cbce", background: "#4ba6ed" }}
              className="editIcon"
            >
              <i
                className="fa fa-phone"
                aria-hidden="true"
                style={{ cursor: "pointer", fontSize: "16px" }}
              ></i>
            </Link>

            {/* Edit */}
            <Link
              to={`${row.original.leadId}`}
              style={{ color: "#51cbce" }}
              className="editIcon"
            >
              <i
                className="fa fa-pencil-square-o"
                aria-hidden="true"
                style={{ cursor: "pointer", fontSize: "16px" }}
              ></i>
            </Link>
            {/* Edit */}
            <Link
              onClick={(e) => {
                e.preventDefault();
                toggleTransfer(
                  row.original.leadId,
                  row.original.allocatedTo?.userId
                );
              }}
              style={{ color: "#51cbce", background: "#ab7a53" }}
              className="editIcon"
            >
              <i
                className="fa fa-exchange"
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

                    {/* Created Date Range */}
                    <Col md="4">
                      <FormGroup>
                        <label>Created Date Range</label>
                        <DatePicker
                          selected={inputdata.createdDate.fromDate || null}
                          onChange={(dates) =>
                            handleDateChange(dates, "createdDate")
                          }
                          startDate={inputdata.createdDate.fromDate || null}
                          endDate={inputdata.createdDate.toDate || null}
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

                    {/* Next Followup Date Range */}
                    <Col md="4">
                      <FormGroup>
                        <label>Next Followup Date Range</label>
                        <DatePicker
                          selected={inputdata.nextFollowup.fromDate || null}
                          onChange={(dates) =>
                            handleDateChange(dates, "nextFollowup")
                          }
                          startDate={inputdata.nextFollowup.fromDate || null}
                          endDate={inputdata.nextFollowup.toDate || null}
                          selectsRange
                          isClearable
                          dateFormat="yyyy-MM-dd"
                          placeholderText="Select Date Range"
                          className="form-control"
                          // maxDate={currentDate} // Disable future dates
                          disabled={!selectedOrganizationId}
                          minDate={new Date()} // Prevent selecting past dates
                        />
                      </FormGroup>
                    </Col>
                    {/* Next Followup Date Range */}
                    <Col md="4">
                      <FormGroup>
                        <label>Allocated To</label>
                        <Input
                          type="select"
                          name="allocatedTo"
                          value={inputdata.allocatedTo || ""}
                          onChange={(e) => {
                            const allocatedTo = parseInt(e.target.value, 10);
                            setInputData((prev) => ({ ...prev, allocatedTo }));
                          }}
                          className="form-control"
                          disabled={!selectedOrganizationId}
                        >
                          <option value="" disabled>
                            -- Select a allocated to --
                          </option>
                          {userListsdata.map((user) => (
                            <option key={user.userId} value={user.userId}>
                              {`${user.firstName} ${user.lastName}`}
                            </option>
                          ))}
                        </Input>
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
          routeURL={routeURL}
          tabletitle={"LEADS"}
          columnsData={columnsData}
          tableData={leadsData}
        />

        {/* Modal Transfer lead popup */}
        <Modal
          isOpen={modal}
          {...args}
          className="custom-modal"
          style={{ marginRight: "0px", marginTop: "0px", border: "none" }}
        >
          <ModalHeader toggle={toggleTransfer}>Lead Transfer</ModalHeader>
          <ModalBody>
            <Transfer
              selectedLeadId={selectedLeadId}
              selectedUserId={selectedUserId}
              cancle={handleCancel}
            />
          </ModalBody>
        </Modal>
      </div>

      {/* Modal WhatsApp popup */}
      <div>
        <Modal isOpen={modalToggle} {...args}>
          <ModalHeader toggle={toggle}>WhatsApp Message</ModalHeader>
          <ModalBody>
            <WhatsAppModal
              mobileNumber={selectedWhatsAppNumber}
              cancle={toggle}
            />
          </ModalBody>
        </Modal>
      </div>

      {/* Modal Followups popup */}
      <Modal
        isOpen={modalFollwups}
        {...args}
        className="fullscreen"
        style={{
          marginRight: "0px !important",
          marginTop: "0px !important",
          border: "none",
        }}
        fullscreen
      >
        <ModalHeader toggle={handleFollwupsCancel}>LEADS FOLLOWUPS</ModalHeader>
        <ModalBody>
          <Followups
            selectedLeadId={selectedLeadId}
            selectedLeadRowData={selectedLeadRowData}
            cancle={handleFollwupsCancel}
          />
        </ModalBody>
      </Modal>
    </>
  );
}

export default Leads;
