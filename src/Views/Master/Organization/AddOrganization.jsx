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
  getOrganizationById,
  postOrganization,
  updateOrganizationById,
} from "../../../services/masterService";

function AddOrganization() {
  const navigate = useNavigate();
  const { organizationId } = useParams(); // Extract organization from URL parameters
  const [title, setTitle] = useState("");
  const [hasFetched, setHasFetched] = useState(false); // To prevent multiple API calls
  const [isLoading, setIsLoading] = useState(false);
  const [inputdata, setInputdata] = useState({
    organization: "",
    website: "",
    address: {
      addressLine1: "",
      addressLine2: "",
      country: "",
      state: "",
      city: "",
      pincode: "",
    },
    status: "ACTIVE",
  });
  const isFormValid = inputdata.organization && inputdata.status; // Check if the required fields are filled

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
      if (organizationId) {
        setIsLoading(true);
        setTitle("Edit Organization");
        const fetchOrganizations = async () => {
          try {
            const response = await getOrganizationById(organizationId); // Await the asynchronous call

            if (response.status === 200) {
              if (response?.data?.success) {
                setIsLoading(false);
                //console.log("Role Data", response?.data?.data?.role);
                const fetchedData = response?.data?.data?.organization;
                setInputdata({
                  organization: fetchedData?.organization || "",
                  website: fetchedData?.website || "",
                  address: {
                    addressLine1: fetchedData?.address?.address_line_1 || "",
                    addressLine2: fetchedData?.address?.address_line_2 || "",
                    country: fetchedData?.address?.country || "",
                    state: fetchedData?.address?.state || "",
                    city: fetchedData?.address?.city || "",
                    pincode: fetchedData?.address?.pincode || "",
                  },
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
        setTitle("Add Organization");
      }
    }
  }, [hasFetched]);

  // Form validation
  const validateForm = () => {
    const newErrors = {};
    if (!inputdata.organization) {
      newErrors.organization = "Enter your organization";
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
      if (!organizationId) {
        response = await postOrganization(inputdata);
      } else {
        response = await updateOrganizationById(organizationId, inputdata);
      }

      if (
        (response.status === 200 || response.status === 201) &&
        response?.data?.success
      ) {
        toast.success("Organization saved successfully!");
        setTimeout(() => navigate("/admin/master/organization"), 3000); // Navigate after showing the toast
      } else {
        toast.error("Failed to save the organization. Please try again.");
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
                          ORGANIZATION NAME <span className="star">*</span>
                        </label>
                        <Input
                          style={{
                            borderColor: errors.organization
                              ? "red"
                              : "#90909A",
                          }}
                          placeholder="Organization"
                          type="text"
                          name="organization"
                          value={inputdata.organization}
                          onChange={handleInputChange}
                        />
                        {errors.organization && (
                          <p className="error-message text-danger">
                            {errors.organization}
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
                    <Col className="pr-1" md="6">
                      <FormGroup>
                        <label>ADDRESS LINE 1</label>
                        <Input
                          placeholder="Address Line 1"
                          type="text"
                          name="address.addressLine1"
                          value={inputdata.address.addressLine1}
                          onChange={handleInputChange}
                        />
                      </FormGroup>
                    </Col>

                    <Col className="pr-1" md="6">
                      <FormGroup>
                        <label>ADDRESS LINE 2</label>
                        <Input
                          placeholder="Address Line 1"
                          type="text"
                          name="address.addressLine2"
                          value={inputdata.address.addressLine2}
                          onChange={handleInputChange}
                        />
                      </FormGroup>
                    </Col>
                    <Col className="pr-1" md="6">
                      <FormGroup>
                        <label>COUNTRY</label>
                        <Input
                          placeholder="Country"
                          type="text"
                          name="address.country"
                          value={inputdata.address.country}
                          onChange={handleInputChange}
                        />
                      </FormGroup>
                    </Col>
                    <Col className="pr-1" md="6">
                      <FormGroup>
                        <label>STATE</label>
                        <Input
                          placeholder="State"
                          type="text"
                          name="address.state"
                          value={inputdata.address.state}
                          onChange={handleInputChange}
                        />
                      </FormGroup>
                    </Col>
                    <Col className="pr-1" md="6">
                      <FormGroup>
                        <label>CITY</label>
                        <Input
                          placeholder="City"
                          type="text"
                          name="address.city"
                          value={inputdata.address.city}
                          onChange={handleInputChange}
                        />
                      </FormGroup>
                    </Col>
                    <Col className="pr-1" md="6">
                      <FormGroup>
                        <label>PINCODE</label>
                        <Input
                          placeholder="Pincode"
                          type="text"
                          name="address.pincode"
                          value={inputdata.address.pincode}
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
                        <Link
                          to="/admin/master/organization"
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

export default AddOrganization;
