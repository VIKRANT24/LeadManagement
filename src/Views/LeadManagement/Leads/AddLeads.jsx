import React, { useContext, useEffect, useState } from "react";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardTitle,
  FormGroup,
  Form,
  Input,
  Row,
  Col,
  Spinner,
} from "reactstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import DatePicker from "react-datepicker";
import { format } from "date-fns"; // Import format function
import {
  getUserOrganizations,
  getUserlists,
} from "../../../services/masterService";
import {
  getContacts,
  getLeadById,
  getLeadsSource,
  getLeadsStatus,
  getLeadsTag,
  getReference,
  postNewLeads,
  updateLeadById,
} from "../../../services/leadService";
import AuthContext from "../../../store/auth/auth-context";

function AddLeads() {
  const navigate = useNavigate();
  const { leadId } = useParams(); // Extract contactId from URL parameters
  const [title, setTitle] = useState("");
  const userdata = useContext(AuthContext);
  const [hasFetched, setHasFetched] = useState(false); // To prevent multiple API calls
  const [organizationMappingData, setOrganizationMappingData] = useState([]);
  const [selectedOrganizationId, setSelectedOrganizationId] = useState(null);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [newProjectId, setNewProjectId] = useState(null);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [leadSourceData, setLeadSourceData] = useState([]);
  const [leadsTagData, setLeadsTagsData] = useState([]);
  const [contactsData, setContactsData] = useState([]);
  const [referenceData, setReferencesData] = useState([]);
  const [leadsStatusData, setStatusData] = useState([]);
  const [userListsdata, setUserListsdata] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [inputData, setInputData] = useState({
    organizationId: null,
    projectId: null,
    serviceId: null,
    leadSourceId: null,
    leadTagId: null,
    allocatedTo: null,
    contactId: null,
    referenceId: null,
    dueDate: "",
    estimateAmount: null,
    closedAmount: null,
    nextFollowupDate: "",
    nextFollowupTime: "",
    remarks: "",
    lostReason: "",
    leadStatusId: null,
  });
  const isFormValid =
    // inputData.organizationId &&
    // inputData.projectId &&
    inputData.serviceId &&
    inputData.leadSourceId &&
    inputData.leadTagId &&
    inputData.contactId &&
    inputData.leadStatusId; // Check if the required fields are filled

  const [errors, setErrors] = useState({});
  // formated Date
  const formatDate = (date) => {
    return date ? format(new Date(date), "yyyy-MM-dd") : "";
  };
  // Form input change handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const nameParts = name.split(".");

    // Check if the field is mobileNumber or whatsAppNumber and parse as integer
    if (name === "mobileNumber" || name === "whatsAppNumber") {
      const parsedValue = value ? parseInt(value.replace(/\D/g, ""), 10) : 0;
      setInputData((prev) => {
        const updatedData = { ...prev };
        updatedData[name] = parsedValue;
        return updatedData;
      });
    } else {
      setInputData((prev) => {
        const updatedData = { ...prev };
        if (nameParts.length === 2) {
          updatedData[nameParts[0]][nameParts[1]] = value;
        } else {
          updatedData[name] = value;
        }
        return updatedData;
      });
    }
  };

  // Fetch Organizations
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
      organizationId: orgId,
    }));
  };

  const handleProjectChange = (e) => {
    const projId = parseInt(e.target.value, 10);

    // Update the selected project ID
    setSelectedProjectId(projId);

    // Update inputData with the new project ID
    setInputData((prev) => ({
      ...prev,
      projectId: projId,
    }));

    // Trigger fetch functions after updating the state
    getLeadsTagData(projId);
    getLeadsStatusData(projId);
  };

  // Fetch Projects
  useEffect(() => {
    if (selectedOrganizationId) {
      const selectedOrg = organizationMappingData.find(
        (org) => org.organizationId === selectedOrganizationId
      );
      setFilteredProjects(selectedOrg ? selectedOrg.projects : []);
      //  setSelectedProjectId(null);
      // setInputData((prev) => ({ ...prev, projectId: null }));
      setFilteredServices([]);
    }
  }, [selectedOrganizationId, organizationMappingData]);

  // Fetch Services
  useEffect(() => {
    if (selectedProjectId) {
      const selectedProj = filteredProjects.find(
        (proj) => proj.projectId === selectedProjectId
      );
      setFilteredServices(selectedProj ? selectedProj.services : []);
    }
  }, [selectedProjectId, filteredProjects]);

  // Fetch Leads Source
  useEffect(() => {
    if (!hasFetched) {
      const fetchData = async () => {
        try {
          const response = await getLeadsSource();

          if (response.status === 200) {
            if (response?.data?.success) {
              setLeadSourceData(response?.data?.data?.leadSources);
              setHasFetched(true);
            }
          } else {
            if (response?.status !== 404) {
              toast.error(
                response?.response?.data?.error?.message ||
                  "Failed to fetch leads source data."
              );
            }
          }
        } catch (error) {
          if (response?.status !== 404) {
            toast.error(
              "An error occurred while fetching leads source data. Please try again."
            );
            console.error("Error:", error);
          }
        }
      };

      fetchData();
    }
  }, [hasFetched]);

  // Fetch Leads Tag
  const getLeadsTagData = (projectId) => {
    const payload = { projectId: projectId };
    const fetchLeadsTagData = async () => {
      try {
        const response = await getLeadsTag(payload);

        if (response.status === 200 && response?.data?.success) {
          setLeadsTagsData(response?.data?.data?.leadTags || []);
          // console.log("LeadsTagsData...........", leadsTagData);
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
    fetchLeadsTagData();
  };

  // Fetch Contacts
  useEffect(() => {
    if (!hasFetched) {
      const fetchContacts = async () => {
        try {
          const response = await getContacts();

          if (response.status === 200) {
            if (response?.data?.success) {
              setContactsData(response?.data?.data?.contacts);
              setHasFetched(true);
            }
          } else {
            toast.error(
              response?.data?.message || "Failed to fetch contacts data."
            );
          }
        } catch (error) {
          toast.error(
            "An error occurred while fetching contacts data. Please try again."
          );
          console.error("Error:", error);
        }
      };

      fetchContacts();
    }
  }, [hasFetched]);

  // Fetch References
  useEffect(() => {
    if (!hasFetched) {
      const fetchReference = async () => {
        try {
          const response = await getReference();

          if (response.status === 200) {
            if (response?.data?.success) {
              setReferencesData(response?.data?.data?.references);
              setHasFetched(true);
            }
          } else {
            toast.error(
              response?.data?.message || "Failed to fetch references data."
            );
          }
        } catch (error) {
          toast.error(
            "An error occurred while fetching references data. Please try again."
          );
          console.error("Error:", error);
        }
      };

      fetchReference();
    }
  }, [hasFetched]);

  // Fetch Leads Status Data
  const getLeadsStatusData = (projectId) => {
    // if (selectedProjectId) {
    const payload = { projectId: projectId };
    const fetchLeadsStatusData = async () => {
      try {
        const response = await getLeadsStatus(payload);

        if (response.status === 200 && response?.data?.success) {
          setStatusData(response?.data?.data?.leadStatuses || []);
        } else {
          toast.error(
            response?.data?.message || "Failed to fetch lead status data."
          );
          setStatusData([]);
        }
      } catch (error) {
        toast.error("Error fetching lead status data. Please try again.");
        console.error("Error:", error);
        setStatusData([]);
      }
    };
    fetchLeadsStatusData();
  };

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

  useEffect(() => {
    if (!hasFetched) {
      if (leadId) {
        setIsLoading(true);
        setTitle("Edit Leads");
        const fetchOrganizations = async () => {
          try {
            const response = await getLeadById(leadId);

            if (response.status === 200) {
              if (response?.data?.success) {
                setIsLoading(false);
                const fetchedData = response?.data?.data?.lead;
                // console.log("fetchedData", fetchedData);
                setSelectedOrganizationId(
                  fetchedData?.organization?.organizationId
                );
                setSelectedProjectId(fetchedData?.project?.projectId);
                setNewProjectId(fetchedData?.project?.projectId);

                setInputData({
                  organizationId:
                    fetchedData?.organization?.organizationId || null,
                  projectId: fetchedData?.project?.projectId || null,
                  serviceId: fetchedData?.service?.serviceId || null,
                  leadSourceId: fetchedData?.leadSource?.leadSourceId || null,
                  leadTagId: fetchedData?.leadTag?.leadTagId || null,
                  allocatedTo: fetchedData?.allocatedTo?.userId || null,
                  contactId: fetchedData?.contact?.contactId || null,
                  referenceId: fetchedData?.reference?.referenceId || null,
                  dueDate: fetchedData?.dates?.dueDate || "",
                  estimateAmount: fetchedData?.amounts?.estimateAmount || null,
                  closedAmount: fetchedData?.amounts?.closedAmount || null,
                  nextFollowupDate:
                    fetchedData?.dates?.nextFollowup?.date || "",
                  nextFollowupTime:
                    fetchedData?.dates?.nextFollowup?.time || "",
                  remarks: fetchedData?.remarks || "",
                  lostReason: fetchedData?.lostReason || "",
                  leadStatusId: fetchedData?.leadStatus?.leadStatusId || null,
                });
                getLeadsTagData(fetchedData?.project?.projectId);
                getLeadsStatusData(fetchedData?.project?.projectId);
                setHasFetched(true);
              }
            } else {
              toast.error(
                response?.data?.message || "Failed to fetch contact data."
              );
            }
          } catch (error) {
            toast.error(
              "An error occurred while fetching contact data. Please try again."
            );
            console.error("Error:", error);
          }
        };

        fetchOrganizations();
      } else {
        setTitle("Add Leads");
      }
    }
  }, [hasFetched]);

  useEffect(() => {
    if (inputData.projectId) {
      //console.log("asafafads--------------", inputData.projectId);

      // Call your functions when projectId is updated
      getLeadsTagData(inputData.projectId); // Fetch the lead tags based on the selected project
      getLeadsStatusData(inputData.projectId); // Fetch leads status based on the selected project
    }
  }, [inputData.projectId]);

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    if (!inputData.organizationId) {
      newErrors.organizationId = "Select organization";
    }
    if (!inputData.projectId) {
      newErrors.projectId = "Select project";
    }
    if (!inputData.serviceId) {
      newErrors.serviceId = "Select service";
    }
    if (!inputData.leadSourceId) {
      newErrors.leadSourceId = "Select lead source";
    }
    if (!inputData.leadTagId) {
      newErrors.leadTagId = "Select lead tag";
    }
    if (!inputData.allocatedTo) {
      newErrors.allocatedTo = "Select allocated to";
    }
    if (!inputData.contactId) {
      newErrors.contactId = "Select contact";
    }
    if (!inputData.leadStatusId) {
      newErrors.leadStatusId = "Select lead status";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const payloadData = {
      ...inputData,
      // allocatedTo: parseInt(localStorage.getItem("userId"), 10), // Convert to integer
      dueDate: formatDate(inputData.dueDate),
      nextFollowupDate: formatDate(inputData.nextFollowupDate),
      estimateAmount: parseInt(inputData.estimateAmount, 10),
      closedAmount: parseInt(inputData.closedAmount, 10),
    };
    // console.log("userID", localStorage.getItem("userId"));

    // setLoading(true);
    let response; // Declare `response` here
    try {
      if (!leadId) {
        response = await postNewLeads(payloadData);
      } else {
        response = await updateLeadById(leadId, payloadData);
      }

      if (
        (response.status === 200 || response.status === 201) &&
        response?.data?.success
      ) {
        toast.success("leads saved successfully!");
        setTimeout(() => navigate("/admin/lead/leads"), 3000); // Navigate after showing the toast
      } else {
        toast.error("Failed to save the leads. Please try again.");
      }
    } catch (error) {
      console.error("Error during form submission:", error);
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
      } else if (error.request) {
        console.error("Request made but no response received:", error.request);
      } else {
        console.error("Error setting up the request:", error.message);
      }
      toast.error("An error occurred during submission.");
    } finally {
      // setLoading(false);
    }
  };

  return (
    <>
      <div className="content">
        {isLoading && (
          <div className="spinner">
            <Spinner>Loading...</Spinner>
          </div>
        )}
        {/* Toast Container */}
        <ToastContainer position="top-right" autoClose={1000} />
        <Row>
          <Col md="12">
            <Card className="card-user">
              <CardHeader>
                <CardTitle tag="h5">{title}</CardTitle>
              </CardHeader>
              <CardBody>
                <div>{title} details</div>

                <Form className="mt-3">
                  <Row>
                    <Col className="pr-1" md="6">
                      <FormGroup>
                        <label>
                          SELECT ORGANIZATION <span className="star">*</span>
                        </label>
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
                        {errors.organizationId && (
                          <p className="error-message text-danger">
                            {errors.organizationId}
                          </p>
                        )}
                      </FormGroup>
                    </Col>
                    <Col className="pr-1" md="6">
                      <FormGroup>
                        <label>
                          SELECT PROJECT <span className="star">*</span>
                        </label>
                        <Input
                          type="select"
                          name="projectId"
                          value={inputData.projectId || ""}
                          onChange={handleProjectChange}
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
                        {errors.projectId && (
                          <p className="error-message text-danger">
                            {errors.projectId}
                          </p>
                        )}
                      </FormGroup>
                    </Col>
                    <Col className="pr-1" md="6">
                      <FormGroup>
                        <label>
                          SELECT SERVICES <span className="star">*</span>
                        </label>
                        <Input
                          type="select"
                          name="serviceId"
                          value={inputData.serviceId || ""}
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
                        {errors.serviceId && (
                          <p className="error-message text-danger">
                            {errors.serviceId}
                          </p>
                        )}
                      </FormGroup>
                    </Col>
                    <Col className="pr-1" md="6">
                      <FormGroup>
                        <label>
                          SELECT LEAD SOURCE <span className="star">*</span>
                        </label>
                        <Input
                          type="select"
                          name="leadSourceId"
                          value={inputData.leadSourceId || ""}
                          onChange={(e) => {
                            const leadSourceId = parseInt(e.target.value, 10);
                            setInputData((prev) => ({ ...prev, leadSourceId }));
                          }}
                          className="form-control"
                        >
                          <option value="" disabled>
                            -- Select a service --
                          </option>
                          {leadSourceData.map((leadSource) => (
                            <option
                              key={leadSource.leadSourceId}
                              value={leadSource.leadSourceId}
                            >
                              {leadSource.leadSource}
                            </option>
                          ))}
                        </Input>
                        {errors.serviceId && (
                          <p className="error-message text-danger">
                            {errors.serviceId}
                          </p>
                        )}
                      </FormGroup>
                    </Col>

                    <Col className="pr-1" md="6">
                      <FormGroup>
                        <label>
                          SELECT LEAD TAG <span className="star">*</span>
                        </label>
                        <Input
                          type="select"
                          name="leadTagId"
                          value={inputData.leadTagId || ""}
                          onChange={(e) => {
                            const leadTagId = parseInt(e.target.value, 10);
                            setInputData((prev) => ({ ...prev, leadTagId }));
                          }}
                          className="form-control"
                          disabled={!selectedProjectId}
                        >
                          <option value="" disabled>
                            -- Select a service --
                          </option>
                          {leadsTagData.map((leadTag) => (
                            <option
                              key={leadTag.leadTagId}
                              value={leadTag.leadTagId}
                            >
                              {leadTag.leadTag}
                            </option>
                          ))}
                        </Input>
                        {errors.leadTagId && (
                          <p className="error-message text-danger">
                            {errors.leadTagId}
                          </p>
                        )}
                      </FormGroup>
                    </Col>
                    <Col className="pr-1" md="6">
                      <FormGroup>
                        <label>
                          ALLOCATED TO <span className="star">*</span>
                        </label>
                        <Input
                          style={{
                            borderColor: errors.allocatedTo ? "red" : "#90909A",
                          }}
                          type="select"
                          name="allocatedTo"
                          value={inputData.allocatedTo || ""}
                          onChange={(e) => {
                            const allocatedTo = parseInt(e.target.value, 10); // Correcting the state key to followupBy
                            setInputData((prev) => ({ ...prev, allocatedTo })); // Update the correct field
                          }}
                          className="form-control"
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
                        {errors.allocatedTo && (
                          <p className="error-message text-danger">
                            {errors.allocatedTo}{" "}
                            {/* Corrected the error key to followupBy */}
                          </p>
                        )}
                      </FormGroup>
                    </Col>
                    <Col className="pr-1" md="6">
                      <FormGroup>
                        <label>
                          SELECT CONTACT <span className="star">*</span>
                        </label>
                        <Input
                          type="select"
                          name="contactId"
                          value={inputData.contactId || ""}
                          onChange={(e) => {
                            const contactId = e.target.value
                              ? parseInt(e.target.value, 10)
                              : "";
                            setInputData((prev) => ({ ...prev, contactId }));
                          }}
                          className="form-control"
                        >
                          <option value="" disabled>
                            -- Select a contact --
                          </option>
                          {contactsData?.map((contact) => (
                            <option
                              key={contact.contactId}
                              value={contact.contactId}
                            >
                              {`${contact.salutation || ""} ${
                                contact.firstName || ""
                              } ${contact.lastName || ""}`.trim()}
                            </option>
                          ))}
                        </Input>
                        {errors.contactId && (
                          <p className="error-message text-danger">
                            {errors.contactId}
                          </p>
                        )}
                      </FormGroup>
                    </Col>
                    <Col className="pr-1" md="6">
                      <FormGroup>
                        <label>SELECT REFERENCE</label>
                        <Input
                          type="select"
                          name="referenceId"
                          value={inputData.referenceId || ""}
                          onChange={(e) => {
                            const referenceId = e.target.value
                              ? parseInt(e.target.value, 10)
                              : "";
                            setInputData((prev) => ({ ...prev, referenceId }));
                          }}
                          className="form-control"
                        >
                          <option value="" disabled>
                            -- Select a contact --
                          </option>
                          {referenceData?.map((reference) => (
                            <option
                              key={reference.referenceId}
                              value={reference.referenceId}
                            >
                              {`${reference.salutation || ""} ${
                                reference.firstName || ""
                              } ${reference.lastName || ""}`.trim()}
                            </option>
                          ))}
                        </Input>
                      </FormGroup>
                    </Col>
                    <Col className="pr-1" md="6">
                      <FormGroup>
                        <label>DUE DATE</label>
                        <DatePicker
                          selected={inputData.dueDate || null}
                          onChange={(date) =>
                            setInputData((prev) => ({ ...prev, dueDate: date }))
                          }
                          isClearable
                          dateFormat="yyyy-MM-dd"
                          placeholderText="Select Due Date"
                          className="form-control"
                          minDate={new Date()} // Prevent selecting past dates
                        />
                      </FormGroup>
                    </Col>
                    <Col className="pr-1" md="6">
                      <FormGroup>
                        <label>ESTIMATE AMOUNT</label>
                        <Input
                          placeholder="Estimate Amount"
                          type="text"
                          name="estimateAmount"
                          value={inputData.estimateAmount}
                          onChange={handleInputChange}
                        />
                      </FormGroup>
                    </Col>
                    <Col className="pr-1" md="6">
                      <FormGroup>
                        <label>CLOSED AMOUNT</label>
                        <Input
                          placeholder="Closed Amount"
                          type="text"
                          name="closedAmount"
                          value={inputData.closedAmount}
                          onChange={handleInputChange}
                        />
                      </FormGroup>
                    </Col>
                    <Col className="pr-1" md="6">
                      <FormGroup>
                        <label>NEXT FOLLOWUP DATE</label>
                        <DatePicker
                          selected={inputData.nextFollowupDate || null}
                          onChange={(date) =>
                            setInputData((prev) => ({
                              ...prev,
                              nextFollowupDate: date,
                            }))
                          }
                          isClearable
                          dateFormat="yyyy-MM-dd"
                          placeholderText="Select next followup date"
                          className="form-control"
                          minDate={new Date()} // Prevent selecting past dates
                        />
                      </FormGroup>
                    </Col>
                    <Col className="pr-1" md="6">
                      <FormGroup>
                        <label>NEXT FOLLOWUP TIME</label>
                        <DatePicker
                          selected={
                            inputData.nextFollowupTime
                              ? new Date(
                                  `1970-01-01T${inputData.nextFollowupTime}`
                                )
                              : null
                          }
                          onChange={(date) => {
                            setInputData((prev) => ({
                              ...prev,
                              nextFollowupTime: date
                                ? date.toLocaleTimeString("en-GB")
                                : "", // Format as HH:mm:ss
                            }));
                          }}
                          showTimeSelect
                          showTimeSelectOnly
                          timeFormat="HH:mm:ss"
                          timeIntervals={15}
                          timeCaption="Select Time"
                          dateFormat="HH:mm:ss"
                          placeholderText="Select next followup time"
                          className="form-control"
                        />
                      </FormGroup>
                    </Col>
                    <Col className="pr-1" md="6">
                      <FormGroup>
                        <label>REMARKS</label>
                        <Input
                          type="textarea"
                          name="remarks"
                          placeholder="Enter remarks"
                          value={inputData.remarks}
                          onChange={handleInputChange}
                          className="textarea-100 form-control" // Apply the class here
                          rows="5" // Adjust number of visible lines
                        />
                      </FormGroup>
                    </Col>
                    <Col className="pr-1" md="6">
                      <FormGroup>
                        <label>LOST REASON</label>
                        <Input
                          type="textarea"
                          name="lostReason"
                          placeholder="Enter lostReason"
                          value={inputData.lostReason}
                          onChange={handleInputChange}
                          className="textarea-100 form-control" // Apply the class here
                          rows="5" // Adjust number of visible lines
                        />
                      </FormGroup>
                    </Col>
                    <Col className="pr-1" md="6">
                      <FormGroup>
                        <label>
                          SELECT LEADS STATUS <span className="star">*</span>
                        </label>
                        <Input
                          type="select"
                          name="leadStatusId"
                          value={inputData.leadStatusId || ""}
                          onChange={(e) => {
                            const leadStatusId = parseInt(e.target.value, 10);
                            setInputData((prev) => ({ ...prev, leadStatusId }));
                          }}
                          className="form-control"
                          disabled={!selectedProjectId}
                        >
                          <option value="" disabled>
                            -- Select a service --
                          </option>
                          {leadsStatusData.map((leadStatus) => (
                            <option
                              key={leadStatus.leadStatusId}
                              value={leadStatus.leadStatusId}
                            >
                              {leadStatus.leadStatus}
                            </option>
                          ))}
                        </Input>
                        {errors.leadStatusId && (
                          <p className="error-message text-danger">
                            {errors.leadStatusId}
                          </p>
                        )}
                      </FormGroup>
                    </Col>
                  </Row>

                  <Row>
                    <Col
                      className="pl-1 d-flex justify-content-center align-items-center"
                      md="6"
                    >
                      <div className="update ml-auto mr-auto">
                        <Link
                          to="/admin/lead/leads"
                          className="mt-5 mb-4 text-black"
                        >
                          Cancel
                        </Link>
                      </div>
                    </Col>
                    <Col
                      className="pl-1 d-flex justify-content-center align-items-center"
                      md="6"
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
      </div>
    </>
  );
}

export default AddLeads;
