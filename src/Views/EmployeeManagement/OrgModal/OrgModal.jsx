import React, { useEffect, useState } from "react";
import Select from "react-select";
import { Button, FormGroup, Form, Row, Col, Spinner } from "reactstrap";
import { getUserOrganizations } from "../../../services/masterService";
import { getEmployeeOrg, postEmployeeOrg } from "../../../services/userService";
import { toast } from "react-toastify";

function OrgModal({ employeeId, cancle }) {
  const [organizationMappingData, setOrganizationMappingData] = useState([]);
  const [selectedOrganizations, setSelectedOrganizations] = useState([]);
  const [inputData, setInputData] = useState({ add: [], remove: [] });
  const [isLoading, setIsLoading] = useState(false);
  const [hasFetched, setHasFetched] = useState(false); // To prevent multiple API calls
  // Fetch all available organizations
  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const response = await getUserOrganizations();
        if (response.status === 200 && response?.data?.success) {
          const allOrganizations =
            response?.data?.data?.organizationMapping || [];

          setOrganizationMappingData(allOrganizations);

          // Compute `remove` (organizations that are not selected)
          const allOrgIds = allOrganizations.map((org) => org.organizationId);
          const remove = allOrgIds.filter(
            (orgId) => !selectedOrganizations.includes(orgId)
          );

          setInputData({ add: selectedOrganizations, remove });
        } else {
          if (response?.status !== 404) {
            toast.error(
              response?.response?.data?.error?.message ||
                "Failed to fetch Data."
            );
          }
        }
      } catch (error) {
        if (response?.status !== 404) {
          toast.error("Error fetching Data. Please try again.");
          console.error("Error:", error);
        }
      }
    };

    fetchOrganizations();
  }, [selectedOrganizations]); // Runs after selectedOrganizations updates

  // Fetch employee organizations if employeeId is available
  useEffect(() => {
    if (!hasFetched) {
      if (employeeId) {
        setIsLoading(true);
        const fetchEmployeeOrganizations = async () => {
          try {
            const response = await getEmployeeOrg(employeeId);
            if (response.status === 200 && response?.data?.success) {
              // Extract organization IDs from response
              const fetchedData =
                response?.data?.data?.organizations?.map(
                  (org) => org.organizationId
                ) || [];

              setSelectedOrganizations(fetchedData);
            }
          } catch (error) {
            toast.error("Error fetching employee organizations.");
            console.error("Error:", error);
          } finally {
            setIsLoading(false);
          }
        };

        fetchEmployeeOrganizations();
      }
    }
  }, [hasFetched]);

  // Transform organization data for react-select
  const organizationOptions = organizationMappingData.map((org) => ({
    value: org.organizationId,
    label: org.organization,
  }));

  // Handle multi-select change
  const handleMultiSelectChange = (selectedOptions) => {
    const selectedValues = selectedOptions.map((option) => option.value);
    console.log("selectedOptions", selectedOptions);

    // Get all available organization IDs
    const allOrgIds = organizationOptions.map((org) => org.value);

    // Compute add & remove lists
    const newlyAdded = selectedValues;
    const removed = allOrgIds.filter((org) => !selectedValues.includes(org));

    setSelectedOrganizations(selectedValues);
    setInputData({ add: newlyAdded, remove: removed });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (inputData.add.length === 0 && inputData.remove.length === 0) {
      toast.warning("No changes detected.");
      return;
    }

    await postEmployeeOrg(employeeId, inputData);
    toast.success("Organization updated successfully!");

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
                  <label>Select Organizations</label>
                  <Select
                    name="organizationIds"
                    isMulti
                    isSearchable
                    closeMenuOnSelect={false}
                    hideSelectedOptions={false}
                    options={organizationOptions}
                    value={organizationOptions.filter((org) =>
                      selectedOrganizations.includes(org.value)
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

export default OrgModal;
