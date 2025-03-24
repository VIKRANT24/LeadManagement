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
  getProjectById,
  postProject,
  updateProjectById,
} from "../../../../services/masterService";

function AddProjects({ newOrganizationId, newProjectId, cancle }) {
  const navigate = useNavigate();
  const [organizationId, setOrganizationId] = useState(
    newOrganizationId || null
  );
  const [projectId, setProjectId] = useState(newProjectId || null);
  const [title, setTitle] = useState("");
  const [hasFetched, setHasFetched] = useState(false); // To prevent multiple API calls
  const [isLoading, setIsLoading] = useState(false);
  const [inputdata, setInputdata] = useState({
    projectName: "",
    website: "",
    status: "ACTIVE",
  });
  const isFormValid = inputdata.projectName && inputdata.status; // Check if the required fields are filled

  const [errors, setErrors] = useState({});

  // Form input change handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const nameParts = name.split(".");
    setInputdata((prev) => {
      const updatedData = { ...prev };
      if (nameParts.length === 2) {
        updatedData[nameParts[0]][nameParts[1]] = value;
      } else {
        updatedData[name] = value;
      }
      return updatedData;
    });
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  useEffect(() => {
    if (!hasFetched) {
      if (projectId) {
        setIsLoading(true);
        setTitle("Edit Project");
        const fetchOrganizations = async () => {
          try {
            const response = await getProjectById(organizationId, projectId); // Await the asynchronous call

            if (response.status === 200) {
              if (response?.data?.success) {
                setIsLoading(false);
                //console.log("Role Data", response?.data?.data?.role);
                const fetchedData = response?.data?.data?.project;
                setInputdata({
                  projectName: fetchedData?.projectName || "",
                  website: fetchedData?.website || "",
                  status: fetchedData?.status || "",
                });
                setHasFetched(true); // Set to true after the first fetch
              }
            } else {
              if (response?.status !== 404) {
                toast.error(
                  response?.response?.data?.error?.message ||
                    "Failed to fetch organization data."
                );
              }
            }
          } catch (error) {
            if (response?.status !== 404) {
              toast.error(
                "An error occurred while fetching organization data. Please try again."
              );
              console.error("Error:", error);
            }
          }
        };

        fetchOrganizations(); // Call the async function
      } else {
        setTitle("Add Project");
      }
    }
  }, [hasFetched]);

  // Form validation
  const validateForm = () => {
    const newErrors = {};
    if (!inputdata.projectName) {
      newErrors.projectName = "Enter your project Name";
    }
    if (!inputdata.status) {
      newErrors.status = "Select status";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    // setLoading(true);
    let response; // Declare `response` here

    try {
      if (!projectId) {
        response = await postProject(organizationId, inputdata);
      } else {
        // console.log("dfsdfmsdfs;");

        response = await updateProjectById(
          organizationId,
          projectId,
          inputdata
        );
      }

      if (
        (response.status === 200 || response.status === 201) &&
        response?.data?.success
      ) {
        toast.success("Projects saved successfully!");
        // setTimeout(
        //   () =>
        //     navigate(`/admin/master/organization/projects/${organizationId}`),
        //   3000
        // ); // Navigate after showing the toast
        setTimeout(() => {
          cancle(); // This function will close the modal and reset the selected ID if needed
        }, 2000);
      } else {
        toast.error("Failed to save the projects. Please try again.");
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
                          PROJECT NAME <span className="star">*</span>
                        </label>
                        <Input
                          style={{
                            borderColor: errors.projectName ? "red" : "#90909A",
                          }}
                          placeholder="project Name"
                          type="text"
                          name="projectName"
                          value={inputdata.projectName}
                          onChange={handleInputChange}
                        />
                        {errors.projectName && (
                          <p className="error-message text-danger">
                            {errors.projectName}
                          </p>
                        )}
                      </FormGroup>
                    </Col>

                    <Col className="pr-1" md="6">
                      <FormGroup>
                        <label>WEBSITE</label>
                        <Input
                          placeholder="Website"
                          type="text"
                          name="website"
                          value={inputdata.website}
                          onChange={handleInputChange}
                        />
                      </FormGroup>
                    </Col>

                    <Col className="pl-1" md="6">
                      <FormGroup>
                        <label>
                          STATUS <span className="star">*</span>
                        </label>
                        <Input
                          style={{
                            borderColor: errors.status ? "red" : "#90909A",
                          }}
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

export default AddProjects;
