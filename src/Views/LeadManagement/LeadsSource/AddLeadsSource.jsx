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
  getLeadsSourceById,
  postLeadsSource,
  updateLeadsSourceById,
} from "../../../services/leadService";
import { bgColor } from "../../../Variables/commonData";

function AddLeadsSource() {
  const navigate = useNavigate();
  const { leadSourceId } = useParams(); // Extract ReferenceId from URL parameters
  const [title, setTitle] = useState("");
  const [hasFetched, setHasFetched] = useState(false); // To prevent multiple API calls
  const [isLoading, setIsLoading] = useState(false);
  const [inputData, setInputData] = useState({
    leadSource: "",
    bgColor: "",
    status: "ACTIVE",
  });
  const isFormValid = inputData.leadSource && inputData.status; // Check if the required fields are filled

  const [errors, setErrors] = useState({});

  // Form input change handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputData((prev) => ({
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
      if (leadSourceId) {
        setIsLoading(true);
        setTitle("Edit Lead Source");
        const fetchLeadSource = async () => {
          try {
            const response = await getLeadsSourceById(leadSourceId); // Await the asynchronous call

            if (response.status === 200) {
              if (response?.data?.success) {
                setIsLoading(false);
                //console.log("Role Data", response?.data?.data?.role);
                const fetchedData = response?.data?.data?.leadSource;
                setInputData({
                  leadSource: fetchedData?.leadSource || "",
                  bgColor: fetchedData?.bgColor || "",
                  status: fetchedData?.status || "",
                });
                setHasFetched(true); // Set to true after the first fetch
              }
            } else {
              if (response?.status !== 404) {
                toast.error(
                  response?.response?.data?.error?.message ||
                    "Failed to fetch lead source data."
                );
              }
            }
          } catch (error) {
            if (response?.status !== 404) {
              toast.error(
                "An error occurred while fetching lead source data. Please try again."
              );
              console.error("Error:", error);
            }
          }
        };

        fetchLeadSource(); // Call the async function
      } else {
        setTitle("Add Lead Source");
      }
    }
  }, [hasFetched]);

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    // Validate email ID
    if (!inputData.leadSource) {
      newErrors.leadSource = "Enter your lead source";
    }

    // Validate status
    if (!inputData.status) {
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

    // setLoading(true);
    let response; // Declare `response` here
    try {
      if (!leadSourceId) {
        response = await postLeadsSource(inputData);
      } else {
        response = await updateLeadsSourceById(leadSourceId, inputData);
      }

      if (
        (response.status === 200 || response.status === 201) &&
        response?.data?.success
      ) {
        toast.success("Leads source saved successfully!");
        setTimeout(() => navigate("/admin/lead/leadsSource"), 3000); // Navigate after showing the toast
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
                          LEAD SOURCE <span className="star">*</span>
                        </label>
                        <Input
                          placeholder="Lead Source"
                          type="text"
                          name="leadSource"
                          value={inputData.leadSource}
                          onChange={handleInputChange}
                        />
                      </FormGroup>
                      {errors.leadSource && (
                        <p className="error-message text-danger">
                          {errors.leadSource}
                        </p>
                      )}
                    </Col>

                    <Col className="pr-1" md="6">
                      <FormGroup>
                        <label>BACKGROUND COLOR</label>
                        <Input
                          type="select"
                          name="bgColor"
                          value={inputData.bgColor || ""}
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
                        <Link
                          to="/admin/lead/leadsSource"
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

export default AddLeadsSource;
