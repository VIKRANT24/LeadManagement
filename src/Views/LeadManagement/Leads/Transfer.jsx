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
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { getUserlists } from "../../../services/masterService";
import { putLeadsTransfered } from "../../../services/leadService";

function Transfer({ selectedLeadId, selectedUserId, cancle }) {
  // console.log(selectedLeadId, cancle);

  const [inputData, setInputData] = useState({
    leadIds: [selectedLeadId],
    toUserId: selectedUserId,
    reason: "",
  });
  const isFormValid = inputData.toUserId; // Check if the required fields are filled
  const [errors, setErrors] = useState({});
  const [userListsdata, setUserListsdata] = useState([]);
  const [hasFetched, setHasFetched] = useState(false);

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
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};
    if (!inputData.toUserId) {
      newErrors.toUserId = "Select User Name";
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

    try {
      if (selectedLeadId) {
        response = await putLeadsTransfered(inputData);
      }

      if (
        (response.status === 200 || response.status === 201) &&
        response?.data?.success
      ) {
        toast.success("Lead transfer successfully!");

        setTimeout(() => {
          cancle(); // This function will close the modal and reset the selected ID if needed
        }, 2000);
      } else {
        toast.error("Failed to save the lead transfer. Please try again.");
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
        <Row>
          <Col md="12">
            <Card className="card-user noShadow">
              <CardBody>
                <Form>
                  <Row>
                    <Col className="pr-1" md="12">
                      <FormGroup>
                        <label>SELECT USER</label>
                        <Input
                          type="select"
                          name="allocatedTo"
                          value={inputData.toUserId || ""}
                          onChange={(e) => {
                            const toUserId = parseInt(e.target.value, 10);
                            setInputData((prev) => ({ ...prev, toUserId }));
                          }}
                          className="form-control"
                        >
                          <option value="" disabled>
                            -- Select a allocated to --
                          </option>
                          {userListsdata.map((user) => (
                            <option key={user.userId} value={user.userId}>
                              {`${user.firstName} ${user.lastName}`}
                            </option>
                          ))}
                        </Input>
                      </FormGroup>
                    </Col>

                    <Col className="pl-1" md="12">
                      <FormGroup>
                        <label>REASON</label>
                        <Input
                          type="textarea"
                          name="reason"
                          placeholder="Type reason here"
                          value={inputData.reason}
                          onChange={handleInputChange}
                          className="textarea-100 form-control" // Apply the class here
                          rows="5" // Adjust number of visible lines
                        />
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

export default Transfer;
