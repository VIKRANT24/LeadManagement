import React, { useState, useEffect } from "react";
import LMlogo from "../assets/img/LMlogo.png";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  resendVerficationCode,
  employeeVerifyEmail,
} from "../services/userService";
import { toast, ToastContainer } from "react-toastify";
import { EMAIL_REGEX } from "../utils/regex";

function VerifyCode() {
  const navigate = useNavigate();
  const { verifyCode } = useParams(); // Extract verifyCode from URL parameters
  const { userId } = useParams(); // Extract verifyCode from URL parameters
  const [inputdata, setInputdata] = useState({
    emailId: "", // Persist email from storage
    code: verifyCode || "", // Set code from URL if exists
  });

  const [emailError, setEmailError] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState("");
  const [codeError, setCodeError] = useState(false);
  const [codeErrorMessage, setCodeErrorMessage] = useState("");
  const [autoSubmitTriggered, setAutoSubmitTriggered] = useState(false);

  // const [userId, setUserId] = useState(localStorage.getItem("userIdForVerify"));

  useEffect(() => {
    if (verifyCode) {
      setInputdata((prevState) => ({
        ...prevState,
        code: verifyCode,
      }));
    }
  }, [verifyCode]);

  // useEffect(() => {
  //   if (inputdata.code && !autoSubmitTriggered && inputdata.emailId) {
  //     handleSubmit(); // Auto-submit only if email is available
  //     setAutoSubmitTriggered(true);
  //   }
  // }, [inputdata.code, autoSubmitTriggered, inputdata.emailId]);

  const setErrorAndReturn = (setError, setMessage, message) => {
    setError(true);
    setMessage(message);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputdata({ ...inputdata, [name]: value });
    setEmailError(false);
    setCodeError(false);
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    const { emailId, code } = inputdata;

    if (!emailId) {
      return setErrorAndReturn(
        setEmailError,
        setEmailErrorMessage,
        "Enter your email"
      );
    }
    if (!EMAIL_REGEX.test(emailId)) {
      return setErrorAndReturn(
        setEmailError,
        setEmailErrorMessage,
        "Enter a valid email"
      );
    }
    if (!code) {
      return setErrorAndReturn(
        setCodeError,
        setCodeErrorMessage,
        "Enter your code"
      );
    }

    try {
      const response = await employeeVerifyEmail(inputdata);
      if (response.status === 200 && response?.data?.success) {
        setInputdata({ ...inputdata, code: "" });
        localStorage.removeItem("ragisterEmail");
        navigate("/login");
      } else {
        if (response?.status !== 404) {
          toast.error(
            response?.response?.data?.error?.message ||
              "Verification failed. Please check your code."
          );
        }
      }
    } catch (error) {
      if (response?.status !== 404) {
        toast.error("An error occurred while verifying. Try again.");
        console.error(error);
      }
    }
  };

  const handleResendCodeSubmit = async (e) => {
    if (e) e.preventDefault();

    if (!userId) {
      toast.error("User ID is missing. Cannot resend code.");
      return;
    }

    const payload = {
      purpose: "VERIFY_ACCOUNT",
      userId,
    };

    try {
      const response = await resendVerficationCode(payload);
      if (response.status === 200 && response?.data?.success) {
        toast.success("Verification code resent successfully!");
      } else {
        if (response?.status !== 404) {
          toast.error(
            response?.response?.data?.error?.message ||
              "Failed to resend the verification code."
          );
        }
      }
    } catch (error) {
      if (response?.status !== 404) {
        toast.error("An error occurred. Please try again.");
        console.error(error);
      }
    }
  };

  return (
    <div className="loginBox">
      <ToastContainer position="top-right" autoClose={1000} />
      <form>
        <div className="center mb-4">
          <img src={LMlogo} alt="Logo" />
        </div>
        <div className="center">
          <h3>Verification code</h3>
        </div>
        <div className="mb-3">
          <label className="form-label">EMAIL ID</label>
          <input
            style={{ borderColor: emailError ? "red" : "#90909A" }}
            type="email"
            name="emailId"
            value={inputdata.emailId}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        {emailErrorMessage && (
          <p className="error-message text-danger">{emailErrorMessage}</p>
        )}

        <div className="mb-3">
          <label className="form-label">
            Please enter your verification code.
          </label>
          <input
            style={{ borderColor: codeError ? "red" : "#90909A" }}
            type="text"
            name="code"
            className="form-control"
            value={inputdata.code}
            onChange={handleChange}
          />
        </div>
        {codeErrorMessage && (
          <p className="error-message text-danger">{codeErrorMessage}</p>
        )}

        <div className="mb-3 pull-right">
          <span
            onClick={handleResendCodeSubmit}
            style={{ color: "#000000", cursor: "pointer" }}
          >
            Resend Code
          </span>
        </div>
        <div className="center">
          <button
            type="submit"
            className="btn btn-dark"
            onClick={handleSubmit}
            disabled={!inputdata.code || !inputdata.emailId} // Both fields are required
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}

export default VerifyCode;
