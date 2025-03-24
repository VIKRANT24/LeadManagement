import React, { useEffect, useState } from "react";
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
  getUserlists,
  getUserOrganizations,
} from "../../../services/masterService";
import {
  getCampaignsById,
  getContactCampaigns,
  postCampaigns,
  updateCampaignsById,
} from "../../../services/campaignService";

function AddCampaign({ newServiceId, newCampaignId, cancle }) {
  const navigate = useNavigate();
  const [campaignId, setCampaignId] = useState(newCampaignId);
  const [serviceId, setServiceId] = useState(newServiceId);
  const [title, setTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [userListsdata, setUserListsdata] = useState([]);
  const [organizationMappingData, setOrganizationMappingData] = useState([]);
  const [selectedOrganizationId, setSelectedOrganizationId] = useState(null);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [hasFetched, setHasFetched] = useState(false); //
  const [contactTagData, setContactTagData] = useState([]);
  const [inputData, setInputData] = useState({
    organizationId: null,
    projectId: null,
    serviceId: null,
    campaignName: "",
    description: "",
    startDate: "",
    endDate: "",
    assignedTo: 0,
    contactTagId: 0,
    messageSender: 0,
    status: "ACTIVE",
  });

  const isFormValid =
    selectedOrganizationId !== null &&
    inputData.serviceId &&
    inputData.campaignName &&
    inputData.startDate &&
    inputData.endDate &&
    inputData.assignedTo &&
    inputData.status;

  const [errors, setErrors] = useState({});

  const formatDate = (date) => {
    return date ? format(new Date(date), "yyyy-MM-dd") : "";
  };
  // Form input change handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const nameParts = name.split(".");
    setInputData((prev) => {
      const updatedData = { ...prev };
      if (nameParts.length === 2) {
        updatedData[nameParts[0]][nameParts[1]] = value;
      } else {
        updatedData[name] = value;
      }
      return updatedData;
    });
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
            if (response?.status !== 404) {
              toast.error(
                response?.response?.data?.error?.message ||
                  "Failed to fetch  data."
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
  }, [hasFetched]);

  //  Campaigns Contact Tag
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getContactCampaigns();
        if (response.status === 200 && response?.data?.success) {
          setContactTagData(response?.data?.data?.contactTags || []);
          setHasFetched(true);
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
            "An error occurred while fetching data. Please try again."
          );
          console.error("Error:", error);
        }
      }
    };

    if (!hasFetched) {
      fetchData();
    }
  }, [hasFetched]);

  // Get Template by ID
  useEffect(() => {
    if (campaignId) {
      setIsLoading(true);
      setTitle("Edit Campaigns");
      const fetchData = async () => {
        try {
          const response = await getCampaignsById(serviceId, campaignId);
          if (response.status === 200 && response?.data?.success) {
            const fetchedData = response?.data?.data?.campaign;
            setInputData({
              organizationId: fetchedData?.organization?.organizationId || "",
              projectId: fetchedData?.project?.projectId || "", // Use nullish coalescing to prevent issues
              serviceId: fetchedData?.service?.serviceId || "",
              campaignName: fetchedData?.campaignName || "",
              description: fetchedData?.description || "",
              startDate: fetchedData?.startDate || "",
              endDate: fetchedData?.endDate || "",
              assignedTo: fetchedData?.assignedTo?.userId || "",
              contactTagId: fetchedData?.contactTag?.contactTagId || "",
              messageSender: fetchedData?.messageSender?.userId || "",
              status: fetchedData?.status || "",
            });
            setSelectedOrganizationId(
              fetchedData?.organization?.organizationId
            );
            setSelectedProjectId(fetchedData?.project?.projectId);
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
              "An error occurred while fetching data. Please try again."
            );
            console.error("Error:", error);
          }
        } finally {
          setIsLoading(false);
        }
      };
      fetchData();
    } else {
      setTitle("Add Campaigns");
    }
  }, [campaignId]);

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

  // Handle Organization Change
  const handleOrganizationChange = (e) => {
    const orgId = parseInt(e.target.value, 10);
    setSelectedOrganizationId(orgId);
    setInputData((prev) => ({ ...prev, organizationId: orgId }));
  };

  // Handle Project and Service Filtering
  useEffect(() => {
    if (selectedOrganizationId) {
      const selectedOrg = organizationMappingData.find(
        (org) => org.organizationId === selectedOrganizationId
      );
      setFilteredProjects(selectedOrg ? selectedOrg.projects : []);
      //setSelectedProjectId(null);
      setInputData((prev) => ({ ...prev }));
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

  // Validate Form Inputs
  const validateForm = () => {
    const newErrors = {};
    // Validate serviceId
    if (!inputData.serviceId) {
      newErrors.serviceId = "Select  your service";
    }
    // Validate campaignName
    if (!inputData.campaignName?.trim()) {
      newErrors.campaignName = "Enter  your campaign name";
    }

    // Validate endDate
    if (!inputData.endDate) {
      newErrors.endDate = "Select  your end date";
    }
    // Validate startDate
    if (!inputData.startDate) {
      newErrors.startDate = "Select  your start date";
    }

    // Validate assignedTo
    if (!inputData.assignedTo) {
      newErrors.assignedTo = "Select  your assigned to";
    }

    // Validate status
    if (!inputData.status?.trim()) {
      newErrors.status = "Select  your status";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Create a payload by spreading the inputData and removing organizationId and projectId
    const payload = {
      ...inputData,
      startDate: formatDate(inputData.startDate),
      endDate: formatDate(inputData.endDate),
    };
    delete payload.organizationId;
    delete payload.projectId;

    let response;
    try {
      if (!campaignId) {
        // Submit new template with the filtered data
        response = await postCampaigns(payload);
      } else {
        // Update existing template with the filtered data
        response = await updateCampaignsById(campaignId, payload);
      }

      if (response.status === 200 || response.status === 201) {
        toast.success("Template saved successfully!");
        setTimeout(() => {
          cancle(); // This function will close the modal and reset the selected ID if needed
        }, 2000);
      } else {
        toast.error("Failed to save the Template. Please try again.");
      }
    } catch (error) {
      toast.error("An error occurred during submission.");
      console.error("Error during form submission:", error);
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

        <Row>
          <Col md="12">
            <Card className="card-user noShadow">
              <CardHeader>
                <CardTitle tag="h5">{title}</CardTitle>
              </CardHeader>
              <CardBody>
                {/* <div>{title} details</div> */}

                <Form className="mt-3">
                  <Row>
                    <Col md="6">
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
                      </FormGroup>
                    </Col>

                    {/* Project Selection */}
                    <Col md="6">
                      <FormGroup>
                        <label>
                          SELECT PROJECT <span className="star">*</span>
                        </label>
                        <Input
                          type="select"
                          name="projectId"
                          value={inputData.projectId || ""}
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
                    <Col md="6">
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
                      </FormGroup>
                      {errors.serviceId && (
                        <p className="error-message text-danger">
                          {errors.serviceId}
                        </p>
                      )}
                    </Col>
                    <Col className="pr-1" md="6">
                      <FormGroup>
                        <label>CAMPAIGN NAME</label>
                        <Input
                          placeholder="campaignName"
                          type="text"
                          name="campaignName"
                          value={inputData.campaignName || ""}
                          onChange={handleInputChange}
                        />
                      </FormGroup>
                      {errors.campaignName && (
                        <p className="error-message text-danger">
                          {errors.campaignName}
                        </p>
                      )}
                    </Col>
                    <Col className="pr-1" md="12">
                      <FormGroup>
                        <label>DESCRIPTION</label>
                        <Input
                          type="textarea"
                          name="description"
                          placeholder="Enter description"
                          value={inputData.description}
                          onChange={handleInputChange}
                          className="textarea-100 form-control" // Apply the class here
                          rows="5" // Adjust number of visible lines
                        />
                      </FormGroup>
                    </Col>
                    <Col className="pr-1" md="6">
                      <FormGroup>
                        <label>START DATE</label>
                        <DatePicker
                          selected={inputData.startDate || null}
                          onChange={(date) =>
                            setInputData((prev) => ({
                              ...prev,
                              startDate: date,
                            }))
                          }
                          isClearable
                          dateFormat="yyyy-MM-dd"
                          placeholderText="Select next followup date"
                          className="form-control"
                          minDate={new Date()} // Prevent selecting past dates
                        />
                      </FormGroup>
                      {errors.startDate && (
                        <p className="error-message text-danger">
                          {errors.startDate}
                        </p>
                      )}
                    </Col>
                    <Col className="pr-1" md="6">
                      <FormGroup>
                        <label>END DATE</label>
                        <DatePicker
                          selected={inputData.endDate || null}
                          onChange={(date) =>
                            setInputData((prev) => ({
                              ...prev,
                              endDate: date,
                            }))
                          }
                          isClearable
                          dateFormat="yyyy-MM-dd"
                          placeholderText="Select next followup date"
                          className="form-control"
                          minDate={new Date()} // Prevent selecting past dates
                        />
                      </FormGroup>
                      {errors.endDate && (
                        <p className="error-message text-danger">
                          {errors.endDate}
                        </p>
                      )}
                    </Col>
                    <Col className="pr-1" md="6">
                      <FormGroup>
                        <label>FOLLOWUP BY</label>
                        <Input
                          style={{
                            borderColor: errors.assignedTo ? "red" : "#90909A",
                          }}
                          type="select"
                          name="followupBy"
                          value={inputData.assignedTo || ""}
                          onChange={(e) => {
                            const assignedTo = parseInt(e.target.value, 10); // Correcting the state key to followupBy
                            setInputData((prev) => ({ ...prev, assignedTo })); // Update the correct field
                          }}
                          className="form-control"
                        >
                          <option value="" disabled>
                            -- Select a assigned to --
                          </option>
                          {userListsdata.map((user) => (
                            <option key={user.userId} value={user.userId}>
                              {`${user.firstName} ${user.lastName}`}
                            </option>
                          ))}
                        </Input>
                        {errors.assignedTo && (
                          <p className="error-message text-danger">
                            {errors.assignedTo}{" "}
                            {/* Corrected the error key to assignedTo */}
                          </p>
                        )}
                      </FormGroup>
                    </Col>
                    <Col className="pr-1" md="6">
                      <FormGroup>
                        <label>CONTACT TAG</label>
                        <Input
                          style={{
                            borderColor: errors.contactTagId
                              ? "red"
                              : "#90909A",
                          }}
                          type="select"
                          name="followupBy"
                          value={inputData.contactTagId || ""}
                          onChange={(e) => {
                            const contactTagId = parseInt(e.target.value, 10); // Correcting the state key to followupBy
                            setInputData((prev) => ({ ...prev, contactTagId })); // Update the correct field
                          }}
                          className="form-control"
                        >
                          <option value="" disabled>
                            -- Select a followup by --
                          </option>
                          {contactTagData.map((tag) => (
                            <option
                              key={tag.contactTagId}
                              value={tag.contactTagId}
                            >
                              {`${tag.tagName}`}
                            </option>
                          ))}
                        </Input>
                      </FormGroup>
                    </Col>
                    <Col className="pr-1" md="6">
                      <FormGroup>
                        <label>MESSAGE SENDER</label>
                        <Input
                          style={{
                            borderColor: errors.messageSender
                              ? "red"
                              : "#90909A",
                          }}
                          type="select"
                          name="followupBy"
                          value={inputData.messageSender || ""}
                          onChange={(e) => {
                            const messageSender = parseInt(e.target.value, 10); // Correcting the state key to followupBy
                            setInputData((prev) => ({
                              ...prev,
                              messageSender,
                            })); // Update the correct field
                          }}
                          className="form-control"
                        >
                          <option value="" disabled>
                            -- Select a message Sender --
                          </option>
                          {userListsdata.map((user) => (
                            <option key={user.userId} value={user.userId}>
                              {`${user.firstName} ${user.lastName}`}
                            </option>
                          ))}
                        </Input>
                      </FormGroup>
                    </Col>

                    <Col className="pl-1" md="6">
                      <FormGroup>
                        <label>STATUS</label>
                        <Input
                          style={{
                            borderColor: errors.status ? "red" : "#90909A",
                          }}
                          type="select"
                          name="status"
                          value={inputData.status || "ACTIVE"}
                          onChange={handleInputChange}
                          className="form-control"
                        >
                          <option value="" disabled>
                            -- Select an status --
                          </option>
                          <option value="ACTIVE">Active</option>
                          <option value="PENDING">Pending</option>
                          <option value="DE-ACTIVE">Deactive</option>
                        </Input>
                        {errors.status && (
                          <p className="error-message text-danger">
                            {errors.status}
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
                        <Link onClick={cancle} className="mt-5 mb-4 text-black">
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

export default AddCampaign;
