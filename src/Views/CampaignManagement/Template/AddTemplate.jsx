import React, { useEffect, useState, useRef } from "react";
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
  getTemplateById,
  postTemplate,
  updateTemplateById,
} from "../../../services/campaignService";
import { getUserOrganizations } from "../../../services/masterService";

import "react-quill/dist/quill.snow.css"; // Import styles
import RichTextEditor from "../../../Components/RichTextEditor/RichTextEditor";

function AddTemplate() {
  const navigate = useNavigate();
  const { templateId } = useParams();
  const [title, setTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [userListsdata, setUserListsdata] = useState([]);
  const [organizationMappingData, setOrganizationMappingData] = useState([]);
  const [selectedOrganizationId, setSelectedOrganizationId] = useState(null);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const editorRef = useRef(null);
  const [inputData, setInputData] = useState({
    templateName: "",
    organizationId: null,
    projectId: null,
    serviceId: null,
    sendType: "",
    templateType: "",
    accessType: "",
    subject: "",
    body: "",
    cc: "",
    bcc: "",
    signatureType: "TEXT",
    signature: "string",
    status: "ACTIVE",
  });

  const isFormValid =
    selectedOrganizationId !== null &&
    inputData.templateName &&
    inputData.serviceId &&
    inputData.sendType &&
    inputData.templateType &&
    inputData.accessType &&
    inputData.subject &&
    inputData.body &&
    inputData.status;

  const [errors, setErrors] = useState({});

  const insertAtCursor = (placeholder) => {
    if (editorRef.current) {
      const editor = editorRef.current.getEditor(); // Get Quill editor instance
      const range = editor.getSelection(); // Get cursor position

      if (range) {
        editor.insertText(range.index, placeholder); // Insert placeholder at cursor
        editor.setSelection(range.index + placeholder.length); // Move cursor after inserted text
      }
    }
  };

  // Form input change handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const nameParts = name.split(".");
    setInputData((prev) => {
      const updatedData = { ...prev };
      if (nameParts.length === 2) {
        updatedData[nameParts[0]][nameParts[1]] = value;
      } else {
        updatedData[name] = value;
      }
      return updatedData;
    });
  };

  // Get Template by ID
  useEffect(() => {
    if (templateId) {
      setIsLoading(true);
      setTitle("Edit Template");
      const fetchData = async () => {
        try {
          const response = await getTemplateById(templateId);
          if (response.status === 200 && response?.data?.success) {
            const fetchedData = response?.data?.data?.template;
            setInputData({
              organizationId: fetchedData?.organization?.organizationId || "",
              projectId: fetchedData?.project?.projectId || "",
              templateName: fetchedData?.templateName || "",
              serviceId: fetchedData?.service?.serviceId || "",
              sendType: fetchedData?.sendType || "",
              templateType: fetchedData?.templateType || "",
              accessType: fetchedData?.accessType || "",
              subject: fetchedData?.subject || "",
              body: fetchedData?.body || "",
              cc: fetchedData?.cc || "",
              bcc: fetchedData?.bcc || "",
              signatureType: fetchedData?.signatureType || "",
              signature: fetchedData?.signature || "",
              status: fetchedData?.status || "",
            });
            setSelectedOrganizationId(
              fetchedData?.organization?.organizationId
            );
            setSelectedProjectId(fetchedData?.project?.projectId);
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
        } finally {
          setIsLoading(false);
        }
      };
      fetchData();
    } else {
      setTitle("Add Template");
    }
  }, [templateId]);

  // Fetch Organizations
  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const response = await getUserOrganizations();
        if (response.status === 200 && response?.data?.success) {
          setOrganizationMappingData(
            response?.data?.data?.organizationMapping || []
          );
        } else {
          if (response?.status !== 404) {
            toast.error(
              response?.response?.data?.error?.message ||
                "Failed to fetch organizations."
            );
          }
        }
      } catch (error) {
        if (response?.status !== 404) {
          toast.error("Error fetching organizations. Please try again.");
          console.error("Error:", error);
        }
      }
    };
    fetchOrganizations();
  }, []);

  // Handle Organization Change
  const handleOrganizationChange = (e) => {
    const orgId = parseInt(e.target.value, 10);
    setSelectedOrganizationId(orgId);
    setInputData((prev) => ({ ...prev, organizationId: orgId }));
  };

  // Handle Project and Service Filtering
  useEffect(() => {
    if (selectedOrganizationId) {
      const selectedOrg = organizationMappingData.find(
        (org) => org.organizationId === selectedOrganizationId
      );
      setFilteredProjects(selectedOrg ? selectedOrg.projects : []);
      // setSelectedProjectId(null);
      setInputData((prev) => ({ ...prev }));
      setFilteredServices([]);
    }
  }, [selectedOrganizationId, organizationMappingData]);

  useEffect(() => {
    if (selectedProjectId) {
      const selectedProj = filteredProjects.find(
        (proj) => proj.projectId === selectedProjectId
      );
      setFilteredServices(selectedProj ? selectedProj.services : []);
    }
  }, [selectedProjectId, filteredProjects]);

  // Validate Form Inputs
  const validateForm = () => {
    const newErrors = {};
    if (!inputData.templateName) {
      newErrors.templateName = "Enter template name";
    }
    if (!inputData.serviceId) {
      newErrors.serviceId = "Select service";
    }
    if (!inputData.sendType) {
      newErrors.sendType = "Select Send Type";
    }
    if (!inputData.templateType) {
      newErrors.templateType = "Select template type";
    }
    if (!inputData.accessType) {
      newErrors.accessType = "Select access type";
    }
    if (!inputData.subject) {
      newErrors.subject = "Enter subject";
    }
    if (!inputData.body) {
      newErrors.body = "Enter body text";
    }
    if (!inputData.status) {
      newErrors.status = "Select status";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Create a payload by spreading the inputData and removing organizationId and projectId
    const payload = { ...inputData };
    delete payload.organizationId;
    delete payload.projectId;

    let response;
    try {
      if (!templateId) {
        // Submit new template with the filtered data
        response = await postTemplate(payload);
      } else {
        // Update existing template with the filtered data
        response = await updateTemplateById(templateId, payload);
      }

      if (response.status === 200 || response.status === 201) {
        toast.success("Template saved successfully!");
        setTimeout(() => navigate("/admin/campaign/template"), 3000);
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
                          TEMPLATE NAME <span className="star">*</span>
                        </label>
                        <Input
                          placeholder="Enter template Name"
                          type="text"
                          name="templateName"
                          value={inputData.templateName || ""}
                          onChange={handleInputChange}
                        />
                      </FormGroup>
                      {errors.templateName && (
                        <p className="error-message text-danger">
                          {errors.templateName}
                        </p>
                      )}
                    </Col>

                    <Col md="6">
                      <FormGroup>
                        <label>
                          SELECT ORGANIZATION <span className="star">*</span>
                        </label>
                        <Input
                          type="select"
                          name="organizationId"
                          value={selectedOrganizationId || ""}
                          onChange={handleOrganizationChange}
                          className="form-control"
                        >
                          <option value="" disabled>
                            -- Select an organization --
                          </option>
                          {organizationMappingData.map((org) => (
                            <option
                              key={org.organizationId}
                              value={org.organizationId}
                            >
                              {org.organization}
                            </option>
                          ))}
                        </Input>
                      </FormGroup>
                    </Col>

                    {/* Project Selection */}
                    <Col md="6">
                      <FormGroup>
                        <label>
                          SELECT PROJECT <span className="star">*</span>
                        </label>
                        <Input
                          type="select"
                          name="projectId"
                          value={inputData.projectId || ""}
                          onChange={(e) => {
                            const projectId = parseInt(e.target.value, 10);
                            setSelectedProjectId(projectId);
                            setInputData((prev) => ({ ...prev, projectId }));
                          }}
                          className="form-control"
                          disabled={!selectedOrganizationId}
                        >
                          <option value="" disabled>
                            -- Select a project --
                          </option>
                          {filteredProjects.map((project) => (
                            <option
                              key={project.projectId}
                              value={project.projectId}
                            >
                              {project.projectName}
                            </option>
                          ))}
                        </Input>
                      </FormGroup>
                    </Col>

                    {/* Service Selection */}
                    <Col md="6">
                      <FormGroup>
                        <label>
                          SELECT SERVICES <span className="star">*</span>
                        </label>
                        <Input
                          type="select"
                          name="serviceId"
                          value={inputData.serviceId || ""}
                          onChange={(e) => {
                            const serviceId = parseInt(e.target.value, 10);
                            setInputData((prev) => ({ ...prev, serviceId }));
                          }}
                          className="form-control"
                          disabled={!selectedProjectId}
                        >
                          <option value="" disabled>
                            -- Select a service --
                          </option>
                          {filteredServices.map((service) => (
                            <option
                              key={service.serviceId}
                              value={service.serviceId}
                            >
                              {service.serviceName}
                            </option>
                          ))}
                        </Input>
                        {errors.serviceId && (
                          <p className="error-message text-danger">
                            {errors.serviceId}
                          </p>
                        )}
                      </FormGroup>
                    </Col>
                    <Col className="pl-1" md="6">
                      <FormGroup>
                        <label>
                          SEND TYPE <span className="star">*</span>
                        </label>
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
                          <option value="">NONE</option>
                          <option value="EMAIL">EMAIL</option>
                          <option value="WHATS">WHATS</option>
                          <option value="APP">APP</option>
                          <option value="SMS">SMS</option>
                        </Input>
                        {errors.sendType && (
                          <p className="error-message text-danger">
                            {errors.sendType}
                          </p>
                        )}
                      </FormGroup>
                    </Col>
                    <Col className="pl-1" md="6">
                      <FormGroup>
                        <label>
                          TEMPLATE TYPE <span className="star">*</span>
                        </label>
                        <Input
                          style={{
                            borderColor: errors.templateType
                              ? "red"
                              : "#90909A",
                          }}
                          type="select"
                          name="templateType"
                          value={inputData.templateType}
                          onChange={handleInputChange}
                          className="form-control"
                        >
                          <option value="" disabled>
                            -- Select an template type --
                          </option>
                          <option value="">NONE</option>
                          <option value="LEAD">LEAD</option>
                          <option value="TASK">TASK</option>
                        </Input>
                        {errors.templateType && (
                          <p className="error-message text-danger">
                            {errors.templateType}
                          </p>
                        )}
                      </FormGroup>
                    </Col>
                    <Col className="pl-1" md="6">
                      <FormGroup>
                        <label>
                          ACCESS TYPE <span className="star">*</span>
                        </label>
                        <Input
                          style={{
                            borderColor: errors.accessType ? "red" : "#90909A",
                          }}
                          type="select"
                          name="accessType"
                          value={inputData.accessType}
                          onChange={handleInputChange}
                          className="form-control"
                        >
                          <option value="" disabled>
                            -- Select an access type --
                          </option>
                          <option value="">NONE</option>
                          <option value="PUBLIC">PUBLIC</option>
                          <option value="PRIVATE">PRIVATE</option>
                        </Input>
                        {errors.accessType && (
                          <p className="error-message text-danger">
                            {errors.accessType}
                          </p>
                        )}
                      </FormGroup>
                    </Col>
                    <Col className="pr-1" md="6">
                      <FormGroup>
                        <label>
                          SUBJECT <span className="star">*</span>
                        </label>
                        <Input
                          placeholder="Subject"
                          type="text"
                          name="subject"
                          value={inputData.subject || ""}
                          onChange={handleInputChange}
                        />
                      </FormGroup>
                      {errors.subject && (
                        <p className="error-message text-danger">
                          {errors.subject}
                        </p>
                      )}
                    </Col>

                    <Col className="pr-1" md="6">
                      <FormGroup>
                        <label>CC</label>
                        <Input
                          placeholder="cc"
                          type="text"
                          name="cc"
                          value={inputData.cc || ""}
                          onChange={handleInputChange}
                        />
                      </FormGroup>
                    </Col>
                    <Col className="pr-1" md="6">
                      <FormGroup>
                        <label>BCC</label>
                        <Input
                          placeholder="bcc"
                          type="text"
                          name="bcc"
                          value={inputData.bcc || ""}
                          onChange={handleInputChange}
                        />
                      </FormGroup>
                    </Col>

                    {/* <Col className="pr-1  mb-5" md="12">
                      <FormGroup>
                        <RichTextEditor
                          value={inputData.body}
                          onChange={(value) =>
                            setInputData((prev) => ({ ...prev, body: value }))
                          }
                          error={errors.body}
                        />
                      </FormGroup>
                      {errors.body && (
                        <p className="error-message text-danger">
                          {errors.body}
                        </p>
                      )}
                    </Col> */}
                    {/* <Col className="pr-1  mb-5" md="12">
                      <div>
                        Contact Info: [Salutation], [FirstName], [LastName],
                        [EmailId], [MobileNumber], [WhatsAppNumber], [ContactId]
                      </div>
                      <div>
                        Organization Info: [OrganizationId], [Organization],
                        [ProjectId], [ProjectName], [ServiceId], [ServiceName]
                      </div>
                      <div>
                        Message Sender Info: [SenderSalutation],
                        [SenderFirstName], [SenderLastName], [SenderEmailId],
                        [SenderMobileNumber], [SenderUserId]
                      </div>
                    </Col> */}

                    <Col className="pr-1 mb-5" md="12">
                      <FormGroup>
                        <RichTextEditor
                          ref={editorRef}
                          value={inputData.body}
                          onChange={(value) =>
                            setInputData((prev) => ({ ...prev, body: value }))
                          }
                          error={errors.body}
                        />
                      </FormGroup>
                      {errors.body && (
                        <p className="error-message text-danger">
                          {errors.body}
                        </p>
                      )}
                    </Col>

                    <Col className="pr-1 mb-2" md="12">
                      <div>
                        <strong>Contact Info:</strong>{" "}
                        {[
                          "[Salutation]",
                          "[FirstName]",
                          "[LastName]",
                          "[EmailId]",
                          "[MobileNumber]",
                          "[WhatsAppNumber]",
                          "[ContactId]",
                        ].map((placeholder) => (
                          <button
                            key={placeholder}
                            type="button"
                            className="btn btn-link linkBtn"
                            onClick={() => insertAtCursor(placeholder)}
                          >
                            {placeholder}
                          </button>
                        ))}
                      </div>

                      {/* Organization Info Buttons */}
                      <div>
                        <strong>Organization Info:</strong>{" "}
                        {[
                          "[OrganizationId]",
                          "[Organization]",
                          "[ProjectId]",
                          "[ProjectName]",
                          "[ServiceId]",
                          "[ServiceName]",
                        ].map((placeholder) => (
                          <button
                            key={placeholder}
                            type="button"
                            className="btn btn-link linkBtn"
                            onClick={() => insertAtCursor(placeholder)}
                          >
                            {placeholder}
                          </button>
                        ))}
                      </div>

                      {/* Message Sender Info Buttons */}
                      <div>
                        <strong>Message Sender Info:</strong>{" "}
                        {[
                          "[SenderSalutation]",
                          "[SenderFirstName]",
                          "[SenderLastName]",
                          "[SenderEmailId]",
                          "[SenderMobileNumber]",
                          "[SenderUserId]",
                        ].map((placeholder) => (
                          <button
                            key={placeholder}
                            type="button"
                            className="btn btn-link linkBtn"
                            onClick={() => insertAtCursor(placeholder)}
                          >
                            {placeholder}
                          </button>
                        ))}
                      </div>
                    </Col>

                    <Col className="pl-1 mt-2" md="6">
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
                          to="/admin/campaign/template"
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

export default AddTemplate;
