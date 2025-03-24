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
import Select from "react-select";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { getUserlists } from "../../../services/masterService";
import {
  getContactCampaignsById,
  postContactCampaigns,
  updateContactCampaignsById,
} from "../../../services/campaignService";
import { getContacts } from "../../../services/leadService";

function AddContactTag() {
  const navigate = useNavigate();
  const { contactTagId } = useParams(); // Extract contactId from URL parameters
  const [title, setTitle] = useState("");
  const [hasFetched, setHasFetched] = useState(false); // To prevent multiple API calls
  const [contactsData, setContactsData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [inputdata, setInputdata] = useState({
    tagName: "",
    contactIds: [],
    status: "ACTIVE",
  });

  const isFormValid =
    inputdata.tagName && inputdata.contactIds && inputdata.status;

  const [errors, setErrors] = useState({});

  // Form input change handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const nameParts = name.split(".");

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
  };

  //Get Employee by ID
  useEffect(() => {
    if (!hasFetched) {
      if (contactTagId) {
        setIsLoading(true);
        setTitle("Edit Contact Tag");
        const fetchData = async () => {
          try {
            const response = await getContactCampaignsById(contactTagId); // Await the asynchronous call

            if (response.status === 200) {
              if (response?.data?.success) {
                //console.log("Role Data", response?.data?.data?.role);
                setIsLoading(false);
                const fetchedData = response?.data?.data?.contactTag;
                setInputdata({
                  tagName: fetchedData?.tagName || "",
                  contactIds: fetchedData?.contactIds || "",
                  status: fetchedData?.status || "",
                });
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
      } else {
        setTitle("Add Contact Tag");
      }
    }
  }, [hasFetched]);

  // User Contacts

  useEffect(() => {
    if (!hasFetched) {
      const fetchRoles = async () => {
        try {
          const response = await getContacts(); // Await the asynchronous call

          if (response.status === 200) {
            if (response?.data?.success) {
              setContactsData(response?.data?.data?.contacts); // Assuming `Contacts` contains the roles data
              setHasFetched(true); // Set to true after the first fetch
            }
          } else {
            if (response?.status !== 404) {
              toast.error(
                response?.response?.data?.error?.message ||
                  "Failed to fetch contacts data."
              );
            }
          }
        } catch (error) {
          if (response?.status !== 404) {
            toast.error(
              "An error occurred while fetching contacts data. Please try again."
            );
            console.error("Error:", error);
          }
        }
      };

      fetchRoles(); // Call the async function
    }
  }, [hasFetched]); // Dependency ensures this runs only once

  const validateForm = () => {
    const newErrors = {};

    // Validate tagName
    if (!inputdata.tagName?.trim()) {
      newErrors.tagName = "Enter tag name";
    }

    // Validate contacts
    if (!inputdata.contactIds) {
      newErrors.contactIds = "Select contacts";
    }

    // Validate status
    if (!inputdata.status) {
      newErrors.status = "Select status";
    }

    // Set errors and return validation status
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Modify `handleInputChange` to handle multi-select
  const handleMultiSelectChange = (selectedOptions) => {
    setInputdata((prev) => ({
      ...prev,
      contactIds: selectedOptions
        ? selectedOptions.map((option) => option.value)
        : [],
    }));
  };

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    // setLoading(true);
    let response; // Declare `response` here
    try {
      if (!contactTagId) {
        response = await postContactCampaigns(inputdata);
      } else {
        response = await updateContactCampaignsById(contactTagId, inputdata);
      }

      if (
        (response.status === 200 || response.status === 201) &&
        response?.data?.success
      ) {
        toast.success("Contact saved successfully!");

        setTimeout(() => navigate("/admin/campaign/contactTag"), 3000); // Navigate after showing the toast
      } else {
        toast.error("Failed to save the Contact. Please try again.");
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
            <Card className="card-user" style={{ minHeight: "60vh" }}>
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
                          TAG NAME <span className="star">*</span>
                        </label>
                        <Input
                          placeholder="Tag Name"
                          type="text"
                          name="tagName"
                          value={inputdata.tagName || ""}
                          onChange={handleInputChange}
                        />
                      </FormGroup>
                      {errors.tagName && (
                        <p className="error-message text-danger">
                          {errors.tagName}
                        </p>
                      )}
                    </Col>

                    <Col className="pl-1" md="6">
                      <FormGroup>
                        <label>
                          CONTACTS <span className="star">*</span>
                        </label>
                        <Select
                          name="contactIds"
                          isMulti
                          isSearchable
                          closeMenuOnSelect={false}
                          hideSelectedOptions={false}
                          options={contactsData.map((contact) => ({
                            value: parseInt(contact.contactId, 10), // Ensure it's an integer
                            label: `${contact.firstName} ${contact.lastName}`,
                          }))}
                          value={
                            inputdata.contactIds
                              ?.map((contactId) => {
                                const contact = contactsData.find(
                                  (c) => parseInt(c.contactId, 10) === contactId
                                );
                                return contact
                                  ? {
                                      value: parseInt(contact.contactId, 10),
                                      label: `${contact.firstName} ${contact.lastName}`,
                                    }
                                  : null;
                              })
                              .filter(Boolean) // Remove any null values
                          }
                          onChange={handleMultiSelectChange}
                          className="basic-multi-select"
                          classNamePrefix="select"
                          styles={{
                            option: (styles, { isSelected }) => ({
                              ...styles,
                              display: "flex",
                              alignItems: "center",
                              padding: "10px",
                              backgroundColor: isSelected ? "#007bff" : "white",
                              color: isSelected ? "white" : "black",
                            }),
                          }}
                        />
                      </FormGroup>

                      {errors.contactIds && (
                        <p className="error-message text-danger">
                          {errors.contactIds}
                        </p>
                      )}
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
                          to="/admin/campaign/contactTag"
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
export default AddContactTag;
