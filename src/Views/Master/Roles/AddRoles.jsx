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
  getRoleById,
  getRoles,
  postRole,
  updateRoleById,
} from "../../../services/masterService";

const AddRoles = () => {
  const navigate = useNavigate();
  const { roleId } = useParams(); // Extract roleId from URL parameters
  const [title, setTitle] = useState("");
  const [hasFetched, setHasFetched] = useState(false); // To prevent multiple API calls
  const [rolesData, setRolesData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [inputdata, setInputdata] = useState({
    roleName: "",
    reportingRoleId: 0, // Set initial value as null
    status: "ACTIVE",
  });
  const isFormValid = inputdata.roleName && inputdata.status; // Check if the required fields are filled

  const [errors, setErrors] = useState({});

  // Form input change handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputdata((prev) => ({
      ...prev,
      [name]: name === "reportingRoleId" ? parseInt(value, 10) : value, // Convert to number for reportingRoleId
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };
  // Get Roles data
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
            console.error("Error:", error);
          }
        }
      };

      fetchRoles(); // Call the async function
    }
  }, [hasFetched]); // Dependency ensures this runs only once

  useEffect(() => {
    if (!hasFetched) {
      if (roleId) {
        setIsLoading(true);
        setTitle("Edit Role");
        const fetchRoles = async () => {
          try {
            const response = await getRoleById(roleId); // Await the asynchronous call

            if (response.status === 200) {
              if (response?.data?.success) {
                setIsLoading(false);
                //console.log("Role Data", response?.data?.data?.role);
                const fetchedRole = response?.data?.data?.role;
                setInputdata({
                  roleName: fetchedRole?.roleName || "",
                  reportingRoleId: fetchedRole?.reportingRole?.roleId || null, // Extract reportingRoleId
                  status: fetchedRole?.status || "",
                });
                setHasFetched(true); // Set to true after the first fetch
              }
            } else {
              if (response?.status !== 404) {
                toast.error(
                  response?.response?.data?.error?.message ||
                    "Failed to fetch role data."
                );
              }
            }
          } catch (error) {
            if (response?.status !== 404) {
              toast.error(
                "An error occurred while fetching role data. Please try again."
              );
              console.error("Error:", error);
            }
          }
        };

        fetchRoles(); // Call the async function
      } else {
        setTitle("Add Role");
      }
    }
  }, [hasFetched]);

  // Form validation
  const validateForm = () => {
    const newErrors = {};
    if (!inputdata.roleName) {
      newErrors.roleName = "Enter your role name";
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
    // console.log("inputdata", inputdata);
    // Ensure reportingRoleId is set to 0 if it's null, undefined, or an empty string
    const payload = {
      ...inputdata,
      reportingRoleId: inputdata.reportingRoleId ?? 0, // Set to 0 if null or undefined
    };

    try {
      if (!roleId) {
        response = await postRole(payload);
      } else {
        response = await updateRoleById(roleId, payload);
      }

      if (
        (response.status === 200 || response.status === 201) &&
        response?.data?.success
      ) {
        toast.success("Role saved successfully!");
        setTimeout(() => navigate("/admin/master/roles"), 3000); // Navigate after showing the toast
      } else {
        toast.error("Failed to save the role. Please try again.");
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
                  Mention the Roles
                  <br />
                  Examples: Super-Admin, Admin, Manager, User etc.
                </div>

                <Form className="mt-3">
                  <Row>
                    <Col className="pr-1" md="6">
                      <FormGroup>
                        <label>
                          ROLE <span className="star">*</span>
                        </label>
                        <Input
                          style={{
                            borderColor: errors.roleName ? "red" : "#90909A",
                          }}
                          placeholder="Role"
                          type="text"
                          name="roleName"
                          value={inputdata.roleName}
                          onChange={handleInputChange}
                        />
                        {errors.roleName && (
                          <p className="error-message text-danger">
                            {errors.roleName}
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

                    <Col className="pl-1" md="6">
                      <FormGroup>
                        <label>Reporting To</label>
                        <Input
                          type="select"
                          name="reportingRoleId"
                          value={inputdata.reportingRoleId || ""}
                          onChange={handleInputChange}
                          className="form-control"
                        >
                          <option value="" disabled>
                            -- Select reporting to --
                          </option>

                          {rolesData.map((role) => (
                            <option key={role.roleId} value={role.roleId}>
                              {role.roleName}
                            </option>
                          ))}
                        </Input>
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
                          to="/admin/master/roles"
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
};

export default AddRoles;
