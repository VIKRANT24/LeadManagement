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
import {
  getCampaigns,
  getCampSchedulingById,
  getTemplate,
  postCampScheduling,
  updateCampSchedulingById,
} from "../../../services/campaignService";
import { getUserOrganizations } from "../../../services/masterService";
import DatePicker from "react-datepicker";
import { format } from "date-fns"; // Import format function

function AddCampaignScheduling({ newCampaignId, newCampSchedulingId, cancle }) {
  const [campaignId, setCampaignId] = useState(newCampaignId); // To prevent multiple API calls
  const [campSchedulingId, setCampSchedulingId] = useState(newCampSchedulingId);
  const [title, setTitle] = useState("");
  const [hasFetched, setHasFetched] = useState(false); // To prevent multiple API calls
  const [campSchedulingData, setCampSchedulingData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  // const [organizationMappingData, setOrganizationMappingData] = useState([]);
  // const [selectedOrganizationId, setSelectedOrganizationId] = useState(null);
  // const [selectedProjectId, setSelectedProjectId] = useState(null);
  // const [filteredProjects, setFilteredProjects] = useState([]);
  // const [filteredServices, setFilteredServices] = useState([]);
  const [campaignData, setCampaignData] = useState([]);
  const [templateData, setTemplateData] = useState([]);

  // console.log("campaignId", campaignId);

  const [inputData, setInputData] = useState({
    // organizationId: null,
    // projectId: null,
    // serviceId: null,
    campaignId: null,
    templateId: null,
    sendType: "",
    schedulingDate: null,
    status: "ACTIVE",
  });
  const isFormValid =
    // inputData.campaignId &&
    inputData.templateId &&
    inputData.sendType &&
    inputData.schedulingDate &&
    inputData.status; // Check if the required fields are filled

  const [errors, setErrors] = useState({});

  // Form input change handler

  const formatDate = (date) => {
    return date ? format(new Date(date), "yyyy-MM-dd") : "";
  };
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
    if (!campSchedulingId || hasFetched) return;

    setIsLoading(true);
    getCampSchedulingById(campaignId, campSchedulingId)
      .then((response) => {
        if (response.status === 200 && response.data.success) {
          const fetchedData = response.data.data.scheduling;
          setInputData((prev) => ({
            ...prev,
            campaignId: fetchedData.campaignId || null,
            templateId: fetchedData?.template?.templateId || null,
            sendType: fetchedData.sendType || "",
            schedulingDate: fetchedData.schedulingDate || null,
            status: fetchedData.status || "",
          }));
          setHasFetched(true);
        } else {
          if (response?.status !== 404) {
            toast.error(
              response?.response?.data?.error?.message ||
                "Failed to fetch data."
            );
          }
        }
      })
      .catch(() => toast.error("An error occurred while fetching data."))
      .finally(() => setIsLoading(false));
  }, [campSchedulingId, campaignId]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getTemplate();
        if (response.status === 200 && response?.data?.success) {
          setTemplateData(response?.data?.data?.templates || []);
          setHasFetched(true);
        } else {
          if (response?.status !== 404) {
            toast.error(
              response?.response?.data?.error?.message ||
                "Failed to fetch data."
            );
          }
        }
      } catch (error) {
        if (response?.status !== 404) {
          toast.error(
            "An error occurred while fetching data. Please try again."
          );
          console.error("Error:", error);
        }
      }
    };

    if (!hasFetched) {
      fetchData();
    }
  }, [hasFetched]);

  // Validate Form Inputs
  const validateForm = () => {
    const newErrors = {};

    if (!inputData.templateId) newErrors.templateId = "Select Template";
    if (!inputData.sendType) newErrors.sendType = "Select Send Type";
    if (!inputData.schedulingDate)
      newErrors.schedulingDate = "Select scheduling date";
    if (!inputData.status) newErrors.status = "Select status";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Create a payload with cleaned-up data
    const payload = {
      ...inputData,
      campaignId: campaignId,
    };

    let response;
    try {
      if (!campSchedulingId) {
        // Submit new template
        response = await postCampScheduling(payload);
      } else {
        // Update existing template
        response = await updateCampSchedulingById(campSchedulingId, payload);
      }

      if (response.status === 200 || response.status === 201) {
        toast.success("Template saved successfully!");
        setTimeout(() => {
          cancle(); // Close modal and reset selected ID if needed
        }, 2000);
      } else {
        toast.error("Failed to save the Template. Please try again.");
      }
    } catch (error) {
      toast.error("An error occurred during submission.");
      console.error("Error during form submission:", error);
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

        <Row>
          <Col md="12">
            <Card className="card-user noShadow">
              <CardHeader>
                <CardTitle tag="h5">{title}</CardTitle>
              </CardHeader>
              <CardBody>
                {/* <div>{title} details</div> */}

                <Form className="mt-3">
                  <Row>
                    <Col className="pr-1" md="6">
                      <FormGroup>
                        <label>TEMPLATE</label>
                        <Input
                          style={{
                            borderColor: errors.templateId ? "red" : "#90909A",
                          }}
                          type="select"
                          name="templateId"
                          value={inputData.templateId || ""}
                          onChange={(e) => {
                            const templateId = parseInt(e.target.value, 10); // Correcting the state key to followupBy
                            setInputData((prev) => ({ ...prev, templateId })); // Update the correct field
                          }}
                          className="form-control"
                        >
                          <option value="" disabled>
                            -- Select a Template --
                          </option>
                          {templateData.map((temp) => (
                            <option
                              key={temp.templateId}
                              value={temp.templateId}
                            >
                              {`${temp.templateName}`}
                            </option>
                          ))}
                        </Input>
                        {errors.templateId && (
                          <p className="error-message text-danger">
                            {errors.templateId}
                            {/* Corrected the error key to assignedTo */}
                          </p>
                        )}
                      </FormGroup>
                    </Col>
                    <Col className="pl-1" md="6">
                      <FormGroup>
                        <label>SEND TYPE</label>
                        <Input
                          style={{
                            borderColor: errors.sendType ? "red" : "#90909A",
                          }}
                          type="select"
                          name="sendType"
                          value={inputData.sendType}
                          onChange={handleInputChange}
                          className="form-control"
                        >
                          <option value="" disabled>
                            -- Select an send type --
                          </option>
                          <option value="EMAIL">EMAIL</option>
                          <option value="SMS">SMS</option>
                          <option value="WHATS APP">WHATS APP </option>
                        </Input>
                        {errors.sendType && (
                          <p className="error-message text-danger">
                            {errors.sendType}
                          </p>
                        )}
                      </FormGroup>
                    </Col>
                    <Col className="pr-1" md="6">
                      <FormGroup>
                        <label>SCHEDULING DATE</label>
                        <DatePicker
                          selected={
                            inputData.schedulingDate
                              ? new Date(inputData.schedulingDate)
                              : null
                          }
                          onChange={(date) => {
                            if (!date) return; // Handle clearing
                            const updatedDate = new Date(date);
                            if (inputData.schedulingDate) {
                              const existingTime = new Date(
                                inputData.schedulingDate
                              );
                              updatedDate.setHours(
                                existingTime.getHours(),
                                existingTime.getMinutes(),
                                existingTime.getSeconds()
                              );
                            }
                            setInputData((prev) => ({
                              ...prev,
                              schedulingDate: updatedDate.toISOString(), // Convert to full ISO string
                            }));
                          }}
                          isClearable
                          dateFormat="yyyy-MM-dd"
                          placeholderText="Select scheduling date"
                          className="form-control"
                          minDate={new Date()} // Prevent selecting past dates
                        />
                      </FormGroup>
                    </Col>

                    <Col className="pr-1" md="6">
                      <FormGroup>
                        <label>SCHEDULING TIME</label>
                        <DatePicker
                          selected={
                            inputData.schedulingDate
                              ? new Date(inputData.schedulingDate)
                              : null
                          }
                          onChange={(time) => {
                            if (!time) return; // Handle clearing
                            const updatedDate = inputData.schedulingDate
                              ? new Date(inputData.schedulingDate)
                              : new Date();
                            updatedDate.setHours(
                              time.getHours(),
                              time.getMinutes(),
                              time.getSeconds()
                            );

                            setInputData((prev) => ({
                              ...prev,
                              schedulingDate: updatedDate.toISOString(), // Convert to full ISO string
                            }));
                          }}
                          showTimeSelect
                          showTimeSelectOnly
                          timeFormat="HH:mm:ss"
                          timeIntervals={5}
                          timeCaption="Select Time"
                          dateFormat="HH:mm:ss"
                          placeholderText="Select scheduling time"
                          className="form-control"
                        />
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

export default AddCampaignScheduling;
