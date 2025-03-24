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
import {
  getLeadsTagById,
  postLeadsTag,
  updateLeadsTagById,
} from "../../../services/leadService";
import { getUserOrganizations } from "../../../services/masterService";
import { bgColor } from "../../../Variables/commonData";

function AddLeadsTag({ selectedProjectId, selectedleadTagId, cancle }) {
  const navigate = useNavigate();
  const [projectId, setProjectId] = useState(selectedProjectId); // To prevent multiple API calls
  const [leadTagId, setLeadTagId] = useState(selectedleadTagId);
  const [title, setTitle] = useState("");
  const [hasFetched, setHasFetched] = useState(false); // To prevent multiple API calls
  const [isLoading, setIsLoading] = useState(false);
  const [organizationMappingData, setOrganizationMappingData] = useState([]);
  const [selectedOrganizationId, setSelectedOrganizationId] = useState(null);
  const [filteredProjects, setFilteredProjects] = useState([]);

  const [inputdataOrg, setInputDataOrg] = useState({
    organizationId: null,
    projectId: null,
  });
  const handleOrganizationChange = (e) => {
    const orgId = parseInt(e.target.value, 10);
    setSelectedOrganizationId(orgId);
    setInputDataOrg((prev) => ({
      ...prev,
      organizationId: orgId, // Update inputdata with selected organizationId
    }));
  };
  // Handle setInputDataOrg change
  if (!projectId) {
    const handleOrgInputChange = (e) => {
      const { name, value } = e.target;
      setInputDataOrg((prev) => ({
        ...prev,
        [name]: parseInt(value, 10) || null, // Ensure projectId is always a number
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

    useEffect(() => {
      if (selectedOrganizationId) {
        const selectedOrg = organizationMappingData.find(
          (org) => org.organizationId === selectedOrganizationId
        );
        setFilteredProjects(selectedOrg ? selectedOrg.projects : []);
        setInputDataOrg((prev) => ({ ...prev, projectId: null }));
      }
    }, [selectedOrganizationId, organizationMappingData]);
  }
  ///////

  const [inputdata, setInputdata] = useState({
    leadTag: "",
    projectId: "",
    bgColor: "",
    status: "ACTIVE",
  });
  const isFormValid = inputdata.leadTag && inputdata.status; // Check if the required fields are filled

  const [errors, setErrors] = useState({});

  // Form input change handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setInputdata((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  useEffect(() => {
    if (!hasFetched) {
      if (leadTagId) {
        setIsLoading(true);
        setTitle("Edit Lead Tag");
        const fetchLeadSource = async () => {
          try {
            const response = await getLeadsTagById(leadTagId); // Await the asynchronous call

            if (response.status === 200) {
              if (response?.data?.success) {
                setIsLoading(false);
                //console.log("Role Data", response?.data?.data?.role);
                const fetchedData = response?.data?.data?.leadTags;
                setInputdata({
                  leadTag: fetchedData?.leadTag || "",
                  bgColor: fetchedData?.bgColor || "",
                  status: fetchedData?.status || "",
                });
                setHasFetched(true); // Set to true after the first fetch
              }
            } else {
              if (response?.status !== 404) {
                toast.error(
                  response?.response?.data?.error?.message ||
                    "Failed to fetch lead Tag data."
                );
              }
            }
          } catch (error) {
            if (response?.status !== 404) {
              toast.error(
                "An error occurred while fetching lead Tag data. Please try again."
              );
              console.error("Error:", error);
            }
          }
        };

        fetchLeadSource(); // Call the async function
      } else {
        setTitle("Add Lead Tag");
      }
    }
  }, [hasFetched]);

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    // Validate email ID
    if (!inputdata.leadTag) {
      newErrors.leadTag = "Enter your lead tag";
    }
    // if (!inputdata.projectId) {
    //   newErrors.projectId = "Select Project";
    // }

    // Validate status
    if (!inputdata.status) {
      newErrors.status = "Select status";
    }

    // Set errors and return validation status
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    // Ensure projectId is included in the request payload

    // setLoading(true);
    let response; // Declare `response` here
    try {
      if (!leadTagId) {
        const payload = {
          ...inputdata,
          projectId:
            inputdataOrg.projectId ||
            parseInt(inputdataOrg.projectId, 10) ||
            null, // Ensure projectId is in the payload
        };
        response = await postLeadsTag(payload);
      } else {
        const payload = {
          ...inputdata,
          projectId: inputdata.projectId || parseInt(projectId, 10) || null, // Ensure projectId is in the payload
        };
        response = await updateLeadsTagById(leadTagId, payload);
      }

      if (
        (response.status === 200 || response.status === 201) &&
        response?.data?.success
      ) {
        toast.success("Leads tag saved successfully!");
        // setTimeout(() => navigate("/admin/lead/leadsTag"), 3000); // Navigate after showing the toast
        setTimeout(() => {
          cancle(); // This function will close the modal and reset the selected ID if needed
        }, 2000);
      } else {
        toast.error("Failed to save the leads source. Please try again.");
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

        <Row>
          <Col md="12">
            <Card className="card-user noShadow">
              <CardHeader style={{ paddingTop: "0px" }}>
                <CardTitle tag="h5">{title}</CardTitle>
              </CardHeader>
              <CardBody>
                {/* <div>{title} details</div> */}

                <Form>
                  <Row>
                    {projectId == null && projectId == undefined && (
                      <>
                        <Col className="pr-1" md="12">
                          <FormGroup>
                            <label>
                              SELECT ORGANIZATION{" "}
                              <span className="star">*</span>
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
                        <Col className="pr-1" md="12">
                          <FormGroup>
                            <label>
                              SELECT PROJECT <span className="star">*</span>
                            </label>
                            <Input
                              type="select"
                              name="projectId"
                              value={inputdataOrg.projectId || ""}
                              onChange={(e) => {
                                const projectId = parseInt(e.target.value, 10);
                                setInputDataOrg((prev) => ({
                                  ...prev,
                                  projectId,
                                }));
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
                          {errors.projectId && (
                            <p className="error-message text-danger">
                              {errors.projectId}
                            </p>
                          )}
                        </Col>
                      </>
                    )}
                    <Col className="pr-1" md="12">
                      <FormGroup>
                        <label>
                          LEAD TAG <span className="star">*</span>
                        </label>
                        <Input
                          placeholder="Lead Tag"
                          type="text"
                          name="leadTag"
                          value={inputdata.leadTag}
                          onChange={handleInputChange}
                        />
                      </FormGroup>
                      {errors.leadTag && (
                        <p className="error-message text-danger">
                          {errors.leadTag}
                        </p>
                      )}
                    </Col>

                    <Col className="pr-1" md="12">
                      <FormGroup>
                        <label>BACKGROUND COLOR</label>
                        <Input
                          type="select"
                          name="bgColor"
                          value={inputdata.bgColor || ""}
                          onChange={handleInputChange}
                        >
                          <option value="" disabled>
                            -- Select a Bg Color --
                          </option>
                          <option value="">None</option>
                          {bgColor.map((option) => (
                            <option key={option.name} value={option.color}>
                              {option.name
                                .toLowerCase()
                                .replace(/\b\w/g, (char) => char.toUpperCase())}
                            </option>
                          ))}
                        </Input>
                      </FormGroup>
                    </Col>

                    <Col className="pl-1" md="12">
                      <FormGroup>
                        <label>
                          STATUS <span className="star">*</span>
                        </label>
                        <Input
                          // style={{
                          //   borderColor: errors.status ? "red" : "#90909A",
                          // }}
                          type="select"
                          name="status"
                          value={inputdata.status || "ACTIVE"}
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

export default AddLeadsTag;
