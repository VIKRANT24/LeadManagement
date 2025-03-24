import React, { useEffect, useState } from "react";
import { Line, Pie } from "react-chartjs-2";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardTitle,
  Row,
  Col,
  Form,
  FormGroup,
  Input,
  Button,
  Spinner,
} from "reactstrap";

// Import Chart.js components
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler,
} from "chart.js";
import {
  dashboard24HoursPerformanceChart,
  dashboardEmailStatisticsChart,
  dashboardNASDAQChart,
} from "../../Variables/charts.js";
import {
  getUserlists,
  getUserOrganizations,
} from "../../services/masterService.js";
import { postDashboard } from "../../services/leadService.js";
import { ToastContainer, toast } from "react-toastify";
import ProjectTables from "./ProjectTables.jsx";
import ReuseTable from "./ReuseTable.jsx";
import UserLeadTable from "./UserLeadTable.jsx";

// Register all the necessary components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
);

function Dashboard() {
  const [organizationMappingData, setOrganizationMappingData] = useState([]);
  const [selectedOrganizationId, setSelectedOrganizationId] = useState(null);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [hasFetched, setHasFetched] = useState(false);
  const [dashboardData, setDashboardData] = useState([]);
  const [projectServiceWiseData, setProjectServiceWiseData] = useState([]);
  const [userListsdata, setUserListsdata] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [inputdata, setInputData] = useState({
    organizationId: null,
    projectId: null,
    serviceId: null,
    allocatedTo: null,
  });

  const isFormValid = selectedOrganizationId !== null;
  const handleDateChange = (fieldName) => {
    setInputData((prev) => ({
      ...prev,
    }));
  };

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

  const handleOrganizationChange = (e) => {
    const orgId = parseInt(e.target.value, 10);
    setSelectedOrganizationId(orgId);
    setInputData((prev) => ({
      ...prev,
      organizationId: orgId, // Update inputdata with selected organizationId
    }));
  };

  useEffect(() => {
    if (selectedOrganizationId) {
      const selectedOrg = organizationMappingData.find(
        (org) => org.organizationId === selectedOrganizationId
      );
      setFilteredProjects(selectedOrg ? selectedOrg.projects : []);
      setSelectedProjectId(null);
      setInputData((prev) => ({ ...prev, projectId: null }));
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare the payload with only the selected data
    const payload = {
      organizationId: inputdata.organizationId, // Always include organizationId

      // Only include projectId if it's selected (not null or undefined)
      ...(inputdata.projectId && { projectId: inputdata.projectId }),

      // Only include serviceId if it's selected (not null or undefined)
      ...(inputdata.serviceId && { serviceId: inputdata.serviceId }),
      ...(inputdata.allocatedTo && { allocatedTo: inputdata.allocatedTo }),
    };

    // Remove any properties that are undefined
    Object.keys(payload).forEach(
      (key) => payload[key] === undefined && delete payload[key]
    );
    setIsLoading(true);
    try {
      const response = await postDashboard(payload);
      //  console.log("Response:", response); // Add this to inspect the response

      if (response.status === 200 && response?.data?.success) {
        setIsLoading(false);
        setDashboardData(response?.data?.data || []);
        setProjectServiceWiseData(
          response?.data?.data?.projectServiceWise || []
        );
        // console.log("leadsData", leadsData);
      } else {
        if (response?.status !== 404) {
          const errorMessage =
            response?.response?.data?.error?.message || "Failed to fetch data.";
          toast.error(errorMessage);
        }
        setDashboardData([]);
      }
    } catch (error) {
      if (response?.status !== 404) {
        // toast.error("Error fetching data. Please try again.");
        console.error("Error:", error);
      }
      setLeadsData([]);
    }
  };

  //Select the first organization
  useEffect(() => {
    if (organizationMappingData.length > 0 && !selectedOrganizationId) {
      const firstOrg = organizationMappingData[0]; // Select the first organization
      setSelectedOrganizationId(firstOrg.organizationId);
      setInputData((prev) => ({
        ...prev,
        organizationId: firstOrg.organizationId,
      }));
    }
  }, [organizationMappingData]);

  useEffect(() => {
    if (selectedOrganizationId) {
      handleSubmit(new Event("submit")); // Call handleSubmit when org is selected
    }
  }, [selectedOrganizationId]);

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
            toast.error(response?.data?.message || "Failed to fetch  data.");
          }
        } catch (error) {
          toast.error(
            "An error occurred while fetching  data. Please try again."
          );
          console.error("Error:", error);
        }
      };

      fetchData(); // Call the async function
    }
  }, [hasFetched]);

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
            <Card className="card-user">
              <CardBody>
                <Form className="mt-3">
                  <Row>
                    {/* Organization Selection */}
                    <Col md="3">
                      <FormGroup>
                        <label>Select Organization</label>
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
                    <Col md="3">
                      <FormGroup>
                        <label>Select Project</label>
                        <Input
                          type="select"
                          name="projectId"
                          value={inputdata.projectId || ""}
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
                          <option value="0">None</option>
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
                    <Col md="3">
                      <FormGroup>
                        <label>Select Services</label>
                        <Input
                          type="select"
                          name="serviceId"
                          value={inputdata.serviceId || ""}
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
                          <option value="0">None</option>
                          {filteredServices.map((service) => (
                            <option
                              key={service.serviceId}
                              value={service.serviceId}
                            >
                              {service.serviceName}
                            </option>
                          ))}
                        </Input>
                      </FormGroup>
                    </Col>

                    <Col md="3">
                      <FormGroup>
                        <label>Allocated To</label>
                        <Input
                          type="select"
                          name="allocatedTo"
                          value={inputdata.allocatedTo || ""}
                          onChange={(e) => {
                            const allocatedTo = parseInt(e.target.value, 10);
                            setInputData((prev) => ({ ...prev, allocatedTo }));
                          }}
                          className="form-control"
                          disabled={!selectedOrganizationId}
                        >
                          <option value="" disabled>
                            -- Select a allocated to --
                          </option>
                          <option value="0">None</option>
                          {userListsdata.map((user) => (
                            <option key={user.userId} value={user.userId}>
                              {`${user.firstName} ${user.lastName}`}
                            </option>
                          ))}
                        </Input>
                      </FormGroup>
                    </Col>

                    {/* Submit Button */}

                    <Col
                      className="pl-1 d-flex justify-content-center align-items-center"
                      md="12"
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

        <Row>
          <Col lg="3" md="6" sm="6">
            <Card className="card-stats">
              <CardBody>
                <Row>
                  <Col md="4" xs="5">
                    <div className="icon-big text-center icon-warning">
                      <i className="nc-icon nc-single-02 text-warning" />
                    </div>
                  </Col>
                  <Col md="8" xs="7">
                    <div className="numbers">
                      <p className="card-category">Total Contacts</p>
                      <CardTitle tag="p">
                        {dashboardData.totalContacts}
                      </CardTitle>
                      <p />
                    </div>
                  </Col>
                </Row>
              </CardBody>
              {/* <CardFooter>
                <hr />
                <div className="stats">
                  <i className="fas fa-sync-alt" /> Update Now
                </div>
              </CardFooter> */}
            </Card>
          </Col>
          <Col lg="3" md="6" sm="6">
            <Card className="card-stats">
              <CardBody>
                <Row>
                  <Col md="4" xs="5">
                    <div className="icon-big text-center icon-warning">
                      <i className="nc-icon nc-chat-33 text-success" />
                    </div>
                  </Col>
                  <Col md="8" xs="7">
                    <div className="numbers">
                      <p className="card-category">Total Leads</p>
                      <CardTitle tag="p"> {dashboardData.totalLeads}</CardTitle>
                      <p />
                    </div>
                  </Col>
                </Row>
              </CardBody>
              {/* <CardFooter>
                <hr />
                <div className="stats">
                  <i className="far fa-calendar" /> Last day
                </div>
              </CardFooter> */}
            </Card>
          </Col>
          {/* <Col lg="3" md="6" sm="6">
            <Card className="card-stats">
              <CardBody>
                <Row>
                  <Col md="4" xs="5">
                    <div className="icon-big text-center icon-warning">
                      <i className="nc-icon nc-vector text-danger" />
                    </div>
                  </Col>
                  <Col md="8" xs="7">
                    <div className="numbers">
                      <p className="card-category">Errors</p>
                      <CardTitle tag="p">23</CardTitle>
                      <p />
                    </div>
                  </Col>
                </Row>
              </CardBody>
              <CardFooter>
                <hr />
                <div className="stats">
                  <i className="far fa-clock" /> In the last hour
                </div>
              </CardFooter>
            </Card>
          </Col>
          <Col lg="3" md="6" sm="6">
            <Card className="card-stats">
              <CardBody>
                <Row>
                  <Col md="4" xs="5">
                    <div className="icon-big text-center icon-warning">
                      <i className="nc-icon nc-favourite-28 text-primary" />
                    </div>
                  </Col>
                  <Col md="8" xs="7">
                    <div className="numbers">
                      <p className="card-category">Followers</p>
                      <CardTitle tag="p">+45K</CardTitle>
                      <p />
                    </div>
                  </Col>
                </Row>
              </CardBody>
              <CardFooter>
                <hr />
                <div className="stats">
                  <i className="fas fa-sync-alt" /> Update now
                </div>
              </CardFooter>
            </Card>
          </Col> */}
        </Row>

        <Row>
          <Col md="12">
            <Card>
              <CardHeader>
                <CardTitle tag="h5">Project Service Wise</CardTitle>
              </CardHeader>
              <CardBody>
                <ProjectTables projectsData={projectServiceWiseData} />
                {/* <Line
                  data={dashboard24HoursPerformanceChart.data()}
                  options={dashboard24HoursPerformanceChart.options}
                  width={400}
                  height={100}
                /> */}
              </CardBody>
              {/* <CardFooter>
                <hr />
                <div className="stats">
                  <i className="fa fa-history" /> Updated 3 minutes ago
                </div>
              </CardFooter> */}
            </Card>
          </Col>
        </Row>
        <Row>
          <Col md="4">
            <Card>
              <CardHeader>
                <CardTitle tag="h5">Lead Source</CardTitle>
              </CardHeader>
              <CardBody style={{ height: "300px", overflowY: "auto" }}>
                <ReuseTable data={dashboardData?.leadSource} />
              </CardBody>
            </Card>
          </Col>
          <Col md="4">
            <Card>
              <CardHeader>
                <CardTitle tag="h5">Lead Status</CardTitle>
              </CardHeader>
              <CardBody style={{ height: "300px", overflowY: "auto" }}>
                <ReuseTable data={dashboardData?.leadStatus} />
              </CardBody>
            </Card>
          </Col>
          <Col md="4">
            <Card>
              <CardHeader>
                <CardTitle tag="h5">Lead Tag</CardTitle>
              </CardHeader>
              <CardBody style={{ height: "300px", overflowY: "auto" }}>
                <ReuseTable data={dashboardData?.leadTag} />
              </CardBody>
            </Card>
          </Col>
          <Col md="4">
            <Card>
              <CardHeader>
                <CardTitle tag="h5">Allocated To</CardTitle>
              </CardHeader>
              <CardBody style={{ height: "300px", overflowY: "auto" }}>
                <UserLeadTable data={dashboardData?.allocatedTo} />
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default Dashboard;
