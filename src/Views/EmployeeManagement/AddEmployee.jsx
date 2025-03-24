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
import { EMAIL_REGEX } from "../../utils/regex";
import {
  getRoles,
  getDesignations,
  getUserlists,
} from "../../services/masterService";
import {
  employeeSignup,
  getEmployeeById,
  updateEmployeeById,
} from "../../services/userService";

function AddEmployee() {
  const navigate = useNavigate();
  const { employeeId } = useParams(); // Extract contactId from URL parameters
  const [title, setTitle] = useState("");
  const [hasFetched, setHasFetched] = useState(false); // To prevent multiple API calls
  const [rolesData, setRolesData] = useState([]);
  const [designationsData, setDesignationsData] = useState([]);
  const [userListsdata, setUserListsdata] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState("");
  const [inputdata, setInputdata] = useState({
    firstName: "",
    lastName: "",
    emailId: "",
    contact: {
      countryCode: "+91",
      mobileNumber: null,
    },
    roleId: null,
    designationId: null,
    reportingTo: 0,
    status: "ACTIVE",
  });

  const isFormValid =
    inputdata.firstName &&
    inputdata.lastName &&
    inputdata.emailId &&
    inputdata.contact.countryCode &&
    inputdata.contact.mobileNumber &&
    inputdata.designationId &&
    inputdata.roleId; // Check if the required fields are filled

  const [errors, setErrors] = useState({});

  // Form input change handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const nameParts = name.split(".");

    // Check if the field is 'contact.countryCode' or 'contact.mobileNumber'
    if (nameParts[0] === "contact") {
      setInputdata((prev) => {
        const updatedData = { ...prev };
        if (nameParts[1] === "countryCode") {
          updatedData.contact.countryCode = value; // Update country code
        } else if (nameParts[1] === "mobileNumber") {
          updatedData.contact.mobileNumber = value; // Update mobile number as a string
        }
        return updatedData;
      });
    } else {
      // Handle normal input changes
      setInputdata((prev) => {
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

  //Get Roles
  useEffect(() => {
    if (!hasFetched) {
      const fetchRoles = async () => {
        try {
          const response = await getRoles(); // Await the asynchronous call

          if (response.status === 200) {
            if (response?.data?.success) {
              setRolesData(response?.data?.data?.roles); // Assuming `roles` contains the roles data
              setHasFetched(true); // Set to true after the first fetch
            }
          } else {
            if (response?.status !== 404) {
              toast.error(
                response?.response?.data?.error?.message ||
                  "Failed to fetch roles data."
              );
            }
          }
        } catch (error) {
          if (response?.status !== 404) {
            toast.error(
              "An error occurred while fetching roles data. Please try again."
            );
          }
          console.error("Error:", error);
        }
      };

      fetchRoles(); // Call the async function
    }
  }, [hasFetched]); // Dependency ensures this runs only once

  //getDesignations
  useEffect(() => {
    if (!hasFetched) {
      const fetchRoles = async () => {
        try {
          const response = await getDesignations(); // Await the asynchronous call

          if (response.status === 200) {
            if (response?.data?.success) {
              setDesignationsData(response?.data?.data?.designations); // Assuming `roles` contains the roles data
              setHasFetched(true); // Set to true after the first fetch
            }
          } else {
            if (response?.status !== 404) {
              toast.error(
                response?.response?.data?.error?.message ||
                  "Failed to fetch roles data."
              );
            }
          }
        } catch (error) {
          if (response?.status !== 404) {
            toast.error(
              "An error occurred while fetching roles data. Please try again."
            );
            console.error("Error:", error);
          }
        }
      };

      fetchRoles(); // Call the async function
    }
  }, [hasFetched]); // Dependency ensures this runs only once

  //Get Employee by ID
  useEffect(() => {
    if (!hasFetched) {
      if (employeeId) {
        setIsLoading(true);
        setTitle("Edit Employee");
        const fetchOrganizations = async () => {
          try {
            const response = await getEmployeeById(employeeId); // Await the asynchronous call

            if (response.status === 200) {
              if (response?.data?.success) {
                //console.log("Role Data", response?.data?.data?.role);
                setIsLoading(false);
                const fetchedData = response?.data?.data?.employee;
                setInputdata({
                  firstName: fetchedData?.firstName || "",
                  lastName: fetchedData?.lastName || "",
                  emailId: fetchedData?.emailId || "",
                  contact: {
                    countryCode: fetchedData?.mobileNumber?.countryCode || null,
                    mobileNumber:
                      fetchedData?.mobileNumber?.mobileNumber || null,
                  },
                  roleId: fetchedData?.role?.roleId || null,
                  designationId:
                    fetchedData?.destination?.designationId || null,
                  reportingTo: fetchedData?.reportingUserId || 0,
                  status: fetchedData?.status || "",
                });
                setUserId(fetchedData?.userId);
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

        fetchOrganizations(); // Call the async function
      } else {
        setTitle("Add Employee");
      }
    }
  }, [hasFetched]);

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

  const validateForm = () => {
    const newErrors = {};

    // Validate firstName
    if (!inputdata.firstName?.trim()) {
      newErrors.firstName = "Enter your first name";
    }

    // Validate lastName
    if (!inputdata.lastName?.trim()) {
      newErrors.lastName = "Enter your last name";
    }

    // Validate email ID
    if (!inputdata.emailId?.trim()) {
      newErrors.emailId = "Enter your email ID";
    } else if (!EMAIL_REGEX.test(inputdata.emailId)) {
      newErrors.emailId = "Enter a valid email ID";
    }

    // Validate contact fields (Check if contact exists before accessing)
    if (!inputdata.contact?.countryCode) {
      newErrors.contact = {
        ...newErrors.contact,
        countryCode: "Select your country code",
      };
    }

    if (!inputdata.contact?.mobileNumber) {
      newErrors.contact = {
        ...newErrors.contact,
        mobileNumber: "Enter your mobile number",
      };
    } else if (!/^\d{10}$/.test(String(inputdata.contact.mobileNumber))) {
      newErrors.contact = {
        ...newErrors.contact,
        mobileNumber: "Mobile number must be exactly 10 digits",
      };
    }

    // Validate role
    if (!inputdata.roleId) {
      newErrors.roleId = "Select role";
    }

    // Validate designationId
    if (!inputdata.designationId) {
      newErrors.designationId = "Select designation";
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
      designationId: parseInt(inputdata.designationId, 10), // Convert to integer
      roleId: parseInt(inputdata.roleId, 10), // Convert to integer
      reportingTo: parseInt(inputdata.reportingTo, 10), // Convert to integer
    };
    // Remove `status` if `employeeId` is not present
    if (!employeeId) {
      delete payloadData.status;
    }

    // setLoading(true);
    let response; // Declare `response` here
    try {
      if (!employeeId) {
        response = await employeeSignup(payloadData);
      } else {
        response = await updateEmployeeById(employeeId, payloadData);
      }

      if (
        (response.status === 200 || response.status === 201) &&
        response?.data?.success
      ) {
        if (!employeeId) {
          localStorage.setItem("ragisterEmail", inputdata.emailId);
          localStorage.setItem("userIdForVerify", response.data.data.userId);
          localStorage.setItem("groupId", response.data.data.groupId);
        }
        toast.success("Employee saved successfully!");

        setTimeout(() => navigate("/admin/employee/list"), 3000); // Navigate after showing the toast
      } else {
        if (response?.status !== 404) {
          toast.error(
            response?.response?.data?.error?.message ||
              "Failed to save the Employee. Please try again."
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
                        <label>
                          FIRST NAME <span className="star">*</span>
                        </label>
                        <Input
                          placeholder="First Name"
                          type="text"
                          name="firstName"
                          value={inputdata.firstName || ""}
                          onChange={handleInputChange}
                        />
                      </FormGroup>
                    </Col>
                    <Col className="pr-1" md="6">
                      <FormGroup>
                        <label>
                          LAST NAME <span className="star">*</span>
                        </label>
                        <Input
                          placeholder="Last Name"
                          type="text"
                          name="lastName"
                          value={inputdata.lastName || ""}
                          onChange={handleInputChange}
                        />
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
                          value={inputdata.emailId || ""}
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
                            style={{
                              borderColor: errors.contact?.countryCode
                                ? "red"
                                : "#90909A",
                              maxWidth: "100px",
                            }}
                            className="form-select me-2"
                            name="contact.countryCode"
                            value={inputdata.contact?.countryCode || "+91"}
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
                          <input
                            style={{
                              borderColor: errors.contact?.mobileNumber
                                ? "red"
                                : "#90909A",
                            }}
                            type="text"
                            className="form-control"
                            name="contact.mobileNumber" // Updated name to reflect structure
                            value={inputdata.contact?.mobileNumber || ""}
                            onChange={handleInputChange}
                            onInput={(e) => {
                              // Allow only numeric input and restrict to 10 digits
                              e.target.value = e.target.value
                                .replace(/\D/g, "")
                                .slice(0, 10);
                            }}
                          />
                        </div>
                        {errors.contact?.mobileNumber && (
                          <p className="error-message text-danger">
                            {errors.contact?.mobileNumber}
                          </p>
                        )}
                      </FormGroup>
                    </Col>
                    <Col className="pl-1" md="6">
                      <FormGroup>
                        <label>
                          ROLE <span className="star">*</span>
                        </label>
                        <Input
                          type="select"
                          name="roleId"
                          value={inputdata.roleId || ""}
                          onChange={handleInputChange}
                          className="form-control"
                        >
                          <option value="" disabled>
                            -- Select role --
                          </option>

                          {rolesData.map((role) => (
                            <option key={role.roleId} value={role.roleId}>
                              {role.roleName}
                            </option>
                          ))}
                        </Input>
                      </FormGroup>
                    </Col>
                    <Col className="pl-1" md="6">
                      <FormGroup>
                        <label>
                          DESIGNATION <span className="star">*</span>
                        </label>
                        <Input
                          type="select"
                          name="designationId"
                          value={inputdata.designationId || ""}
                          onChange={handleInputChange}
                          className="form-control"
                        >
                          <option value="" disabled>
                            -- Select designation --
                          </option>

                          {designationsData.map((designation) => (
                            <option
                              key={designation.designationId}
                              value={designation.designationId}
                            >
                              {designation.designation}
                            </option>
                          ))}
                        </Input>
                      </FormGroup>
                    </Col>
                    <Col className="pl-1" md="6">
                      <FormGroup>
                        <label>REPORTING TO</label>
                        <Input
                          type="select"
                          name="reportingTo"
                          value={inputdata.reportingTo || ""}
                          onChange={handleInputChange}
                          className="form-control"
                        >
                          <option value="" disabled>
                            -- Select reporting to --
                          </option>

                          {userListsdata
                            .filter((user) => user.userId !== userId) // Filter users here
                            .map((user) => (
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
                          to="/admin/employee/list"
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

export default AddEmployee;
