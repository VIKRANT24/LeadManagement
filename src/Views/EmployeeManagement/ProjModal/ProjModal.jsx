import React, { useEffect, useState } from "react";
import Select from "react-select";
import { Button, FormGroup, Form, Row, Col, Spinner } from "reactstrap";
import { getUserOrganizations } from "../../../services/masterService";
import {
  getEmployeeProj,
  postEmployeeProj,
} from "../../../services/userService";
import { toast } from "react-toastify";

function ProjModal({ employeeId, cancle }) {
  const [projectOptions, setProjectOptions] = useState([]); // All projects
  const [selectedProjects, setSelectedProjects] = useState([]); // Assigned projects
  const [inputData, setInputData] = useState({ add: [], remove: [] });
  const [isLoading, setIsLoading] = useState(false);
  const [hasFetched, setHasFetched] = useState(false); // To prevent multiple API calls
  // Fetch all projects
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await getUserOrganizations();
        if (response.status === 200 && response?.data?.success) {
          const allProjects = response.data.data.organizationMapping.flatMap(
            (org) =>
              org.projects.map((proj) => ({
                value: proj.projectId,
                label: `${proj.projectName} (${org.organization})`, // Show project with org name
              }))
          );

          setProjectOptions(allProjects);
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
          toast.error("Error fetching projects. Please try again.");
          console.error("Error:", error);
        }
      }
    };

    fetchProjects();
  }, []);

  // Fetch employee's assigned projects
  useEffect(() => {
    if (!hasFetched) {
      if (employeeId) {
        setIsLoading(true);
        const fetchEmployeeProjects = async () => {
          try {
            const response = await getEmployeeProj(employeeId);
            if (response.status === 200 && response?.data?.success) {
              const assignedProjects =
                response?.data?.data?.projects?.map((pro) => pro.projectId) ||
                [];

              setSelectedProjects(assignedProjects);
            }
          } catch (error) {
            toast.error("Error fetching employee projects.");
            console.error("Error:", error);
          } finally {
            setIsLoading(false);
          }
        };

        fetchEmployeeProjects();
      }
    }
  }, [hasFetched]);

  // Compute `add` and `remove` whenever selectedProjects changes
  useEffect(() => {
    const allProjectIds = projectOptions.map((proj) => proj.value);
    const remove = allProjectIds.filter(
      (projId) => !selectedProjects.includes(projId)
    );
    setInputData({ add: selectedProjects, remove });
  }, [selectedProjects, projectOptions]);

  // Handle multi-select change
  const handleMultiSelectChange = (selectedOptions) => {
    const selectedValues = selectedOptions.map((option) => option.value);
    setSelectedProjects(selectedValues);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (inputData.add.length === 0 && inputData.remove.length === 0) {
      toast.warning("No changes detected.");
      return;
    }

    await postEmployeeProj(employeeId, inputData);
    toast.success("Projects updated successfully!");

    setTimeout(() => {
      cancle();
    }, 1000);
  };

  return (
    <div className="content">
      {isLoading && (
        <div className="spinner">
          <Spinner>Loading...</Spinner>
        </div>
      )}
      <Row>
        <Col md="12">
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md="12">
                <FormGroup>
                  <label>Select Projects</label>
                  <Select
                    name="projectIds"
                    isMulti
                    isSearchable
                    closeMenuOnSelect={false}
                    hideSelectedOptions={false}
                    options={projectOptions}
                    value={projectOptions.filter((proj) =>
                      selectedProjects.includes(proj.value)
                    )}
                    onChange={handleMultiSelectChange}
                    className="basic-multi-select"
                    classNamePrefix="select"
                    styles={{
                      option: (styles, { isSelected }) => ({
                        ...styles,
                        padding: "10px",
                        backgroundColor: isSelected ? "#007bff" : "white",
                        color: isSelected ? "white" : "black",
                      }),
                    }}
                  />
                </FormGroup>
              </Col>
            </Row>

            <Row>
              <Col md="6" className="text-center">
                <Button color="secondary" onClick={cancle}>
                  Cancel
                </Button>
              </Col>
              <Col md="6" className="text-center">
                <Button
                  className="btn-round"
                  color="dark"
                  type="submit"
                  disabled={
                    inputData.add.length === 0 && inputData.remove.length === 0
                  }
                >
                  Submit
                </Button>
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>
    </div>
  );
}

export default ProjModal;
