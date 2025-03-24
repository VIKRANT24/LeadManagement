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
  getDesignationById,
  postDesignation,
  updateDesignationById,
} from "../../../services/masterService";

function AddDesignation() {
  const navigate = useNavigate();
  const { designationId } = useParams(); // Extract designationId from URL parameters
  const [title, setTitle] = useState("");
  const [hasFetched, setHasFetched] = useState(false); // To prevent multiple API calls
  const [isLoading, setIsLoading] = useState(false);
  const [inputdata, setInputdata] = useState({
    designation: "",
    status: "ACTIVE",
  });
  const isFormValid = inputdata.designation && inputdata.status; // Check if the required fields are filled

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
      if (designationId) {
        setIsLoading(true);
        setTitle("Edit Designation");
        const fetchDesignations = async () => {
          try {
            const response = await getDesignationById(designationId); // Await the asynchronous call

            if (response.status === 200) {
              if (response?.data?.success) {
                setIsLoading(false);
                //console.log("Role Data", response?.data?.data?.role);
                const fetchedRole = response?.data?.data?.designation;
                setInputdata({
                  designation: fetchedRole?.designation || "",
                  status: fetchedRole?.status || "",
                });
                setHasFetched(true); // Set to true after the first fetch
              }
            } else {
              toast.error(
                response?.data?.message || "Failed to fetch designation data."
              );
            }
          } catch (error) {
            toast.error(
              "An error occurred while fetching designation data. Please try again."
            );
            console.error("Error:", error);
          }
        };

        fetchDesignations(); // Call the async function
      } else {
        setTitle("Add Designation");
      }
    }
  }, [hasFetched]);

  // Form validation
  const validateForm = () => {
    const newErrors = {};
    if (!inputdata.designation) {
      newErrors.designation = "Enter your designation";
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
      if (!designationId) {
        response = await postDesignation(inputdata);
      } else {
        response = await updateDesignationById(designationId, inputdata);
      }

      if (
        (response.status === 200 || response.status === 201) &&
        response?.data?.success
      ) {
        toast.success("Designation saved successfully!");
        setTimeout(() => navigate("/admin/master/designation"), 3000); // Navigate after showing the toast
      } else {
        toast.error("Failed to save the designation. Please try again.");
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
                <div>
                  Mention the Designation
                  <br />
                  Examples: Director, Software Engineer, Accountant etc.
                </div>

                <Form className="mt-3">
                  <Row>
                    <Col className="pr-1" md="6">
                      <FormGroup>
                        <label>
                          DESIGNATION <span className="star">*</span>
                        </label>
                        <Input
                          style={{
                            borderColor: errors.designation ? "red" : "#90909A",
                          }}
                          placeholder="Designation"
                          type="text"
                          name="designation"
                          value={inputdata.designation}
                          onChange={handleInputChange}
                        />
                        {errors.designation && (
                          <p className="error-message text-danger">
                            {errors.designation}
                          </p>
                        )}
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
                        <Link
                          to="/admin/master/designation"
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

export default AddDesignation;
