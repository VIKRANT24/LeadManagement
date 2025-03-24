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
import { EMAIL_REGEX } from "../../../utils/regex";
import {
  getContactById,
  postContact,
  updateContactById,
} from "../../../services/leadService";
import { salutations } from "../../../Variables/commonData.js";

function AddContact() {
  const navigate = useNavigate();
  const { contactId } = useParams(); // Extract contactId from URL parameters
  const [title, setTitle] = useState("");
  const [hasFetched, setHasFetched] = useState(false); // To prevent multiple API calls
  const [isLoading, setIsLoading] = useState(false);
  const [inputdata, setInputdata] = useState({
    emailId: "",
    salutation: "",
    firstName: "",
    lastName: "",
    mobile: {
      countryCode: "+91",
      mobileNumber: "",
    },
    whatsApp: {
      countryCode: "",
      whatsAppNumber: "",
    },
    companyName: "",
    website: "",
    status: "ACTIVE",
  });
  const isFormValid =
    inputdata.emailId &&
    inputdata.mobile.mobileNumber &&
    inputdata.mobile.countryCode &&
    inputdata.status; // Check if the required fields are filled

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
    //}
  };

  useEffect(() => {
    if (!hasFetched) {
      if (contactId) {
        setIsLoading(true);
        setTitle("Edit Contact");
        const fetchOrganizations = async () => {
          try {
            const response = await getContactById(contactId); // Await the asynchronous call

            if (response.status === 200) {
              if (response?.data?.success) {
                setIsLoading(false);
                //console.log("Role Data", response?.data?.data?.role);
                const fetchedData = response?.data?.data?.contact;
                setInputdata({
                  emailId: fetchedData?.emailId || "",
                  mobile: {
                    countryCode: fetchedData?.mobile?.countryCode || "",
                    mobileNumber: fetchedData?.mobile?.mobileNumber || "",
                  },
                  whatsApp: {
                    countryCode: fetchedData?.whatsApp?.countryCode || "",
                    whatsAppNumber: fetchedData?.whatsApp?.whatsAppNumber || "",
                  },
                  salutation: fetchedData?.salutation || "",
                  firstName: fetchedData?.firstName || "",
                  lastName: fetchedData?.lastName || "",
                  companyName: fetchedData?.companyName || "",
                  website: fetchedData?.website || "",
                  status: fetchedData?.status || "",
                });
                setHasFetched(true); // Set to true after the first fetch
              }
            } else {
              if (response?.status !== 404) {
                toast.error(
                  response?.response?.data?.error?.message ||
                    "Failed to fetch contact data."
                );
              }
            }
          } catch (error) {
            if (response?.status !== 404) {
              toast.error(
                "An error occurred while fetching contact data. Please try again."
              );
              console.error("Error:", error);
            }
          }
        };

        fetchOrganizations(); // Call the async function
      } else {
        setTitle("Add Contact");
      }
    }
  }, [hasFetched]);

  // Form validation
  // Form validation
  const validateForm = () => {
    const newErrors = {};

    // Validate firstName
    if (!inputdata.firstName) {
      newErrors.firstName = "Entar first name";
    }

    // Validate last name
    if (!inputdata.lastName) {
      newErrors.lastName = "Entar last name";
    }

    // Validate email ID
    if (!inputdata.emailId) {
      newErrors.emailId = "Enter your email ID";
    } else if (!EMAIL_REGEX.test(inputdata.emailId)) {
      newErrors.emailId = "Enter a valid email ID";
    }

    // Initialize nested error object for mobile
    newErrors.mobile = {};

    // Validate mobile number (only numeric, exactly 10 digits)
    if (!inputdata.mobile.mobileNumber) {
      newErrors.mobile.mobileNumber = "Enter your mobile number";
    } else if (!/^\d{10}$/.test(String(inputdata.mobile.mobileNumber))) {
      newErrors.mobile.mobileNumber = "Mobile number must be exactly 10 digits";
    }

    // Validate mobile country code
    if (!inputdata.mobile.countryCode) {
      newErrors.mobile.countryCode = "Select country code";
    }

    // Validate status
    if (!inputdata.status) {
      newErrors.status = "Select status";
    }

    // Remove the mobile key if there are no mobile errors
    if (Object.keys(newErrors.mobile).length === 0) {
      delete newErrors.mobile;
    }

    // Set errors and return validation status
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const payloadData = {
      ...inputdata,
    };

    // console.log("payloadData...........", payloadData);

    // setLoading(true);
    let response; // Declare `response` here
    try {
      if (!contactId) {
        response = await postContact(payloadData);
      } else {
        response = await updateContactById(contactId, payloadData);
      }

      if (
        (response.status === 200 || response.status === 201) &&
        response?.data?.success
      ) {
        toast.success("Contact saved successfully!");
        setTimeout(() => navigate("/admin/lead/contacts"), 3000); // Navigate after showing the toast
      } else {
        if (response?.status !== 404) {
          toast.error(
            response?.response?.data?.error?.message ||
              "Failed to save the Contact. Please try again."
          );
        }
      }
    } catch (error) {
      if (response?.status !== 404) {
        console.error("Error during form submission:", error);
        if (error.response) {
          console.error("Response data:", error.response.data);
          console.error("Response status:", error.response.status);
        } else if (error.request) {
          console.error(
            "Request made but no response received:",
            error.request
          );
        } else {
          console.error("Error setting up the request:", error.message);
        }
        toast.error("An error occurred during submission.");
      }
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
                        <label>SALUTATION</label>

                        <Input
                          type="select"
                          name="salutation"
                          value={inputdata.salutation || ""}
                          onChange={handleInputChange}
                        >
                          <option value="" disabled>
                            -- Select a salutation --
                          </option>
                          {salutations.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label
                                .toLowerCase()
                                .replace(/\b\w/g, (char) => char.toUpperCase())}
                            </option>
                          ))}
                        </Input>
                      </FormGroup>
                    </Col>
                    <Col className="pr-1" md="6">
                      <FormGroup>
                        <label>
                          FIRST NAME <span className="star">*</span>
                        </label>
                        <Input
                          placeholder="First Name"
                          type="text"
                          name="firstName"
                          value={inputdata.firstName}
                          onChange={handleInputChange}
                        />
                        {errors.firstName && (
                          <p className="error-message text-danger">
                            {errors.firstName}
                          </p>
                        )}
                      </FormGroup>
                    </Col>
                    <Col className="pr-1" md="6">
                      <FormGroup>
                        <label>
                          LASTNAME <span className="star">*</span>
                        </label>
                        <Input
                          placeholder="Last Name"
                          type="text"
                          name="lastName"
                          value={inputdata.lastName}
                          onChange={handleInputChange}
                        />
                        {errors.lastName && (
                          <p className="error-message text-danger">
                            {errors.lastName}
                          </p>
                        )}
                      </FormGroup>
                    </Col>
                    <Col className="pr-1" md="6">
                      <FormGroup>
                        <label>
                          EMAIL ID <span className="star">*</span>
                        </label>
                        <Input
                          style={{
                            borderColor: errors.emailId ? "red" : "#90909A",
                          }}
                          placeholder="Email Id"
                          type="text"
                          name="emailId"
                          value={inputdata.emailId}
                          onChange={handleInputChange}
                        />
                        {errors.emailId && (
                          <p className="error-message text-danger">
                            {errors.emailId}
                          </p>
                        )}
                      </FormGroup>
                    </Col>

                    <Col className="pr-1" md="6">
                      <FormGroup>
                        <label>
                          MOBILE NUMBER <span className="star">*</span>
                        </label>
                        <div className="d-flex">
                          <select
                            className="form-select me-2 w-25"
                            name="mobile.countryCode"
                            value={inputdata.mobile.countryCode || "91"}
                            onChange={handleInputChange}
                          >
                            <option value="">Select</option>
                            <option value="+1">+1 (USA)</option>
                            <option value="+91">+91 (India)</option>
                            <option value="+44">+44 (UK)</option>
                            <option value="+61">+61 (Australia)</option>
                            <option value="+81">+81 (Japan)</option>
                            <option value="+49">+49 (Germany)</option>
                          </select>
                          <Input
                            placeholder="Mobile Number"
                            type="text"
                            name="mobile.mobileNumber"
                            value={inputdata.mobile.mobileNumber}
                            onChange={handleInputChange}
                            onInput={(e) => {
                              e.target.value = e.target.value
                                .replace(/\D/g, "")
                                .slice(0, 10);
                            }}
                          />
                        </div>
                        {errors.mobile && errors.mobile.countryCode && (
                          <p className="error-message text-danger">
                            {errors.mobile.countryCode}
                          </p>
                        )}

                        {errors.mobile && errors.mobile.mobileNumber && (
                          <p className="error-message text-danger">
                            {errors.mobile.mobileNumber}
                          </p>
                        )}
                      </FormGroup>
                    </Col>
                    <Col className="pr-1" md="6">
                      <FormGroup>
                        <label>WHATSAPP NUMBER</label>
                        <div className="d-flex">
                          <select
                            className="form-select me-2 w-25"
                            name="whatsApp.countryCode"
                            value={inputdata.whatsApp.countryCode}
                            onChange={handleInputChange}
                          >
                            <option value="">Select</option>
                            <option value="+1">+1 (USA)</option>
                            <option value="+91">+91 (India)</option>
                            <option value="+44">+44 (UK)</option>
                            <option value="+61">+61 (Australia)</option>
                            <option value="+81">+81 (Japan)</option>
                            <option value="+49">+49 (Germany)</option>
                          </select>
                          <Input
                            placeholder="WhatsApp Number"
                            type="text"
                            name="whatsApp.whatsAppNumber"
                            value={inputdata.whatsApp.whatsAppNumber}
                            onChange={handleInputChange}
                            onInput={(e) => {
                              e.target.value = e.target.value
                                .replace(/\D/g, "")
                                .slice(0, 10);
                            }}
                          />
                        </div>
                        {/* {errors.whatsAppNumber && (
                          <p className="error-message text-danger">
                            {errors.whatsAppNumber}
                          </p>
                        )} */}
                      </FormGroup>
                    </Col>

                    <Col className="pr-1" md="6">
                      <FormGroup>
                        <label>COMPANY NAME</label>
                        <Input
                          placeholder="Company Name"
                          type="text"
                          name="companyName"
                          value={inputdata.companyName}
                          onChange={handleInputChange}
                        />
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
                        <Link
                          to="/admin/lead/contacts"
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

export default AddContact;
