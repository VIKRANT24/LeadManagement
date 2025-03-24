import React, { useState } from "react";
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
import { postWhatsApp } from "../../services/socialService";
import { Link } from "react-router-dom";

function WhatsAppModal({ mobileNumber, cancle }) {
  const [inputData, setInputData] = useState({
    message: "",
  });

  // Form input change handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Form submission handler
  const handleSubmit = async (e) => {
    //console.log("inputData", inputData.message);

    e.preventDefault();
    await postWhatsApp(mobileNumber, inputData.message);
    setTimeout(() => {
      cancle();
    }, 1000);
  };

  return (
    <>
      <div className="content">
        <Row>
          <Col md="12">
            <Form>
              <Row>
                <Col md="12">
                  <FormGroup>
                    {/* <label>Message</label> */}
                    <Input
                      type="textarea"
                      name="message"
                      placeholder="Type message here"
                      value={inputData.message}
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
                    <Link className="mt-5 mb-4 text-black" onClick={cancle}>
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
                      disabled={!inputData.message}
                    >
                      Submit
                    </Button>
                  </div>
                </Col>
              </Row>
            </Form>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default WhatsAppModal;
