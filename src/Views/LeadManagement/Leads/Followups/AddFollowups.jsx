import React, { useContext, useEffect, useState } from "react";
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
  getFollowupsById,
  getLeadsStatus,
  postFollowups,
  updateFollowupsById,
} from "../../../../services/leadService";
import { getUserlists } from "../../../../services/masterService";
import { followupStatus } from "../../../../Variables/commonData.js";

function AddFollowups({ newLeadId, newLeadFollowupId, newProjectId, cancle }) {
  const navigate = useNavigate();
  const [leadFollowupId, setLeadFollowupId] = useState(newLeadFollowupId); // To prevent multiple API calls
  const [leadId, setLeadId] = useState(newLeadId);
  const [projectId, setProjectId] = useState(newProjectId);
  const [title, setTitle] = useState("");
  const [hasFetched, setHasFetched] = useState(false); // To prevent multiple API calls
  const [userListsdata, setUserListsdata] = useState([]);
  const [leadsStatusData, setStatusData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  // const [followupStatus, setfollowupStatus] = useState(followupStatus);
  // console.log("followupStatus", followupStatus);

  const [inputData, setInputData] = useState({
    // leadId: null,
    followupBy: null,
    reportingDetails: "",
    leadStatusId: null,
    nextFollowupDate: "",
    nextFollowupTime: "",
    estimateAmount: null,
    closedAmount: null,
    followupStatus: "",
  });
  const isFormValid =
    // inputData.leadId &&
    // inputData.followupBy &&
    inputData.reportingDetails &&
    inputData.leadStatusId &&
    inputData.nextFollowupDate &&
    inputData.nextFollowupTime &&
    inputData.followupStatus; // Check if the required fields are filled

  const [errors, setErrors] = useState({});

  // formated Date
  const formatDate = (date) => {
    return date ? format(new Date(date), "yyyy-MM-dd") : "";
  };

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
      if (leadFollowupId) {
        setIsLoading(true);
        setTitle("Edit Followups");
        const fetchData = async () => {
          try {
            const response = await getFollowupsById(leadId, leadFollowupId); // Await the asynchronous call

            if (response.status === 200) {
              if (response?.data?.success) {
                setIsLoading(false);
                //console.log("Role Data", response?.data?.data?.role);
                const fetchedData = response?.data?.data?.followup;
                setInputData({
                  // leadId: fetchedData?.leadId || null,
                  followupBy: fetchedData?.followupBy?.userId || null,
                  reportingDetails: fetchedData?.reportingDetails || "",
                  leadStatusId: fetchedData?.leadStatus?.leadStatusId || null,
                  nextFollowupDate: fetchedData?.nextFollowup?.date || "",
                  nextFollowupTime: fetchedData?.nextFollowup?.time || "",
                  estimateAmount: fetchedData?.amounts?.estimateAmount || null,
                  closedAmount: fetchedData?.amounts?.closedAmount || null,
                  followupStatus: fetchedData?.followupStatus || "",
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
        setTitle("Add Followups");
      }
    }
  }, [hasFetched]);

  useEffect(() => {
    if (!hasFetched) {
      if (projectId) {
        const payload = { projectId: parseInt(projectId || "0", 10) };
        const fetchLeadsStatusData = async () => {
          try {
            const response = await getLeadsStatus(payload);

            if (response.status === 200 && response?.data?.success) {
              setStatusData(response?.data?.data?.leadStatuses || []);
            } else {
              if (response?.status !== 404) {
                toast.error(
                  response?.response?.data?.error?.message ||
                    "Failed to fetch lead status data."
                );
              }
              setStatusData([]);
            }
          } catch (error) {
            if (response?.status !== 404) {
              toast.error("Error fetching lead status data. Please try again.");
              console.error("Error:", error);
            }
            setStatusData([]);
          }
        };
        fetchLeadsStatusData();
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

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    // Validate email ID
    // if (!inputData.leadId) {
    //   newErrors.leadId = "Select your lead";
    // }

    //Validate followupBy
    if (!inputData.followupBy) {
      newErrors.followupBy = "Select followup By";
    }
    // Validate reportingDetails
    if (!inputData.reportingDetails) {
      newErrors.reportingDetails = "Enter reporting Details";
    }
    // Validate reportingDetails
    if (!inputData.leadStatusId) {
      newErrors.leadStatusId = "Select lead status";
    }
    // Validate reportingDetails
    if (!inputData.nextFollowupDate) {
      newErrors.nextFollowupDate = "Enter next followup date";
    }
    // Validate reportingDetails
    if (!inputData.nextFollowupTime) {
      newErrors.nextFollowupTime = "Enter next followup Time";
    }
    // Validate reportingDetails
    if (!inputData.followupStatus) {
      newErrors.followupStatus = "Enter followup status";
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
      ...inputData,
      //leadId: parseInt(leadId, 10), // Convert to integer
      nextFollowupDate: formatDate(inputData.nextFollowupDate),
      estimateAmount: parseInt(inputData.estimateAmount, 10),
      closedAmount: parseInt(inputData.closedAmount, 10),
    };
    // setLoading(true);
    let response; // Declare `response` here
    try {
      if (!leadFollowupId) {
        response = await postFollowups(leadId, payloadData);
      } else {
        response = await updateFollowupsById(
          leadId,
          leadFollowupId,
          payloadData
        );
      }

      if (
        (response.status === 200 || response.status === 201) &&
        response?.data?.success
      ) {
        toast.success("Follow up saved successfully!");
        // setTimeout(
        //   () => navigate(`/admin/lead/leads/${projectId}/${leadId}/followups`),
        //   3000
        // ); // Navigate after showing the toast
        setTimeout(() => {
          cancle(); // This function will close the modal and reset the selected ID if needed
        }, 2000);
      } else {
        toast.error("Failed to save the follow up. Please try again.");
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
                          FOLLOWUP BY <span className="star">*</span>
                        </label>
                        <Input
                          // style={{
                          //   borderColor: errors.followupBy ? "red" : "#90909A",
                          // }}
                          type="select"
                          name="followupBy"
                          value={inputData.followupBy || ""}
                          onChange={(e) => {
                            const followupBy = parseInt(e.target.value, 10); // Correcting the state key to followupBy
                            setInputData((prev) => ({ ...prev, followupBy })); // Update the correct field
                          }}
                          className="form-control"
                          disabled={localStorage.getItem("isAdmin") === "false"} // Disable if isAdmin is "false"
                        >
                          <option value="" disabled>
                            -- Select a followup by --
                          </option>
                          {userListsdata.map((user) => (
                            <option key={user.userId} value={user.userId}>
                              {`${user.firstName} ${user.lastName}`}
                            </option>
                          ))}
                        </Input>
                        {errors.followupBy && (
                          <p className="error-message text-danger">
                            {errors.followupBy}
                          </p>
                        )}
                      </FormGroup>
                    </Col>

                    <Col className="pr-1" md="6">
                      <FormGroup>
                        <label>
                          SELECT LEADS STATUS <span className="star">*</span>
                        </label>
                        <Input
                          style={{
                            borderColor: errors.leadStatusId
                              ? "red"
                              : "#90909A",
                          }}
                          type="select"
                          name="leadStatusId"
                          value={inputData.leadStatusId || ""}
                          onChange={(e) => {
                            const leadStatusId = parseInt(e.target.value, 10);
                            setInputData((prev) => ({ ...prev, leadStatusId }));
                          }}
                          className="form-control"
                        >
                          <option value="" disabled>
                            -- Select a Status --
                          </option>
                          {leadsStatusData.map((leadStatus) => (
                            <option
                              key={leadStatus.leadStatusId}
                              value={leadStatus.leadStatusId}
                            >
                              {leadStatus.leadStatus}
                            </option>
                          ))}
                        </Input>
                        {errors.leadStatusId && (
                          <p className="error-message text-danger">
                            {errors.leadStatusId}
                          </p>
                        )}
                      </FormGroup>
                    </Col>

                    <Col className="pr-1" md="6">
                      <FormGroup>
                        <label>ESTIMATE AMOUNT</label>
                        <Input
                          placeholder="Estimate Amount"
                          type="text"
                          name="estimateAmount"
                          value={inputData.estimateAmount || ""}
                          onChange={handleInputChange}
                        />
                      </FormGroup>
                    </Col>
                    <Col className="pr-1" md="6">
                      <FormGroup>
                        <label>CLOSED AMOUNT</label>
                        <Input
                          placeholder="Closed Amount"
                          type="text"
                          name="closedAmount"
                          value={inputData.closedAmount || ""}
                          onChange={handleInputChange}
                        />
                      </FormGroup>
                    </Col>
                    <Col className="pr-1" md="6">
                      <FormGroup>
                        <label>
                          NEXT FOLLOWUP DATE <span className="star">*</span>
                        </label>
                        <DatePicker
                          selected={inputData.nextFollowupDate || null}
                          style={{
                            borderColor: errors.reportingDetails
                              ? "red"
                              : "#90909A",
                          }}
                          onChange={(date) =>
                            setInputData((prev) => ({
                              ...prev,
                              nextFollowupDate: date,
                            }))
                          }
                          isClearable
                          dateFormat="yyyy-MM-dd"
                          placeholderText="Select next followup date"
                          className="form-control"
                          minDate={new Date()} // Prevent selecting past dates
                        />
                        {errors.nextFollowupDate && (
                          <p className="error-message text-danger">
                            {errors.nextFollowupDate}
                          </p>
                        )}
                      </FormGroup>
                    </Col>
                    <Col className="pr-1" md="6">
                      <FormGroup>
                        <label>
                          NEXT FOLLOWUP TIME <span className="star">*</span>
                        </label>
                        <DatePicker
                          style={{
                            borderColor: errors.nextFollowupTime
                              ? "red"
                              : "#90909A",
                          }}
                          selected={
                            inputData.nextFollowupTime
                              ? new Date(
                                  `1970-01-01T${inputData.nextFollowupTime}`
                                )
                              : null
                          }
                          onChange={(date) => {
                            setInputData((prev) => ({
                              ...prev,
                              nextFollowupTime: date
                                ? date.toLocaleTimeString("en-GB")
                                : "", // Format as HH:mm:ss
                            }));
                          }}
                          showTimeSelect
                          showTimeSelectOnly
                          timeFormat="HH:mm:ss"
                          timeIntervals={15}
                          timeCaption="Select Time"
                          dateFormat="HH:mm:ss"
                          minTime={new Date("1970-01-01T09:00:00")} // Min: 9 AM
                          maxTime={new Date("1970-01-01T22:00:00")} // Max: 10 PM
                          placeholderText="Select next followup time"
                          className="form-control"
                        />
                      </FormGroup>
                      {errors.nextFollowupTime && (
                        <p className="error-message text-danger">
                          {errors.nextFollowupTime}
                        </p>
                      )}
                    </Col>
                    <Col className="pr-1" md="6">
                      <FormGroup>
                        <label>
                          FOLLOWUP STATUS <span className="star">*</span>
                        </label>
                        <Input
                          type="select"
                          name="followupStatus"
                          value={inputData.followupStatus || ""}
                          onChange={handleInputChange}
                          style={{
                            borderColor: errors.followupStatus
                              ? "red"
                              : "#90909A",
                          }}
                        >
                          <option value="" disabled>
                            -- Select a status --
                          </option>
                          {followupStatus.map((option) => (
                            <option key={option.status} value={option.status}>
                              {option.status
                                .toLowerCase()
                                .replace(/\b\w/g, (char) => char.toUpperCase())}
                            </option>
                          ))}
                        </Input>
                        {errors.followupStatus && (
                          <p className="error-message text-danger">
                            {errors.followupStatus}
                          </p>
                        )}
                      </FormGroup>
                    </Col>
                    <Col className="pr-1" md="6">
                      <FormGroup>
                        <label>
                          REPORTING DETAILS <span className="star">*</span>
                        </label>
                        <Input
                          style={{
                            borderColor: errors.reportingDetails
                              ? "red"
                              : "#90909A",
                          }}
                          placeholder="Reporting Details"
                          type="textarea"
                          name="reportingDetails"
                          value={inputData.reportingDetails || ""}
                          onChange={handleInputChange}
                          className="textarea-100 form-control" // Apply the class here
                          rows="5" // Adjust number of visible lines
                        />
                      </FormGroup>
                      {errors.reportingDetails && (
                        <p className="error-message text-danger">
                          {errors.reportingDetails}
                        </p>
                      )}
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

export default AddFollowups;
