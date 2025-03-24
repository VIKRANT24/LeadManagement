import React, { useState } from "react";
import LMlogo from "../assets/img/LMlogo.png";
import { Link, useNavigate } from "react-router-dom";
import { EMAIL_REGEX } from "../utils/regex";
import { userSignup } from "../services/userService";
import { ToastContainer, toast } from "react-toastify";

function SignUp() {
  const navigate = useNavigate();

  const [inputdata, setInputdata] = useState({
    firstName: "",
    lastName: "",
    emailId: "",
    contact: {
      countryCode: "+91",
      mobileNumber: "",
    },
    agreement: false,
  });

  const [firstNameError, setFirstNameError] = useState(false);
  const [firstNameErrorMessage, setFirstNameErrorMessage] = useState("");
  const [lastNameError, setLastNameError] = useState(false);
  const [lastNameErrorMessage, setLastNameErrorMessage] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState("");
  const [countryCodeError, setCountryCodeError] = useState(false);
  const [countryCodeErrorMessage, setCountryCodeErrorMessage] = useState("");
  const [mobileNumberError, setMobileNumberError] = useState(false);
  const [mobileNumberErrorMessage, setMobileNumberErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // For mobile number, allow only numeric input
    if (name === "mobileNumber" && !/^\d*$/.test(value)) {
      return; // Prevent non-numeric input
    }

    // Validate mobile number to ensure it's exactly 10 digits
    if (name === "mobileNumber" && value.length > 10) {
      setMobileNumberError(true);
      setMobileNumberErrorMessage("Mobile number cannot exceed 10 digits.");
      return;
    } else {
      setMobileNumberError(false);
      setMobileNumberErrorMessage("");
    }

    if (name === "countryCode" || name === "mobileNumber") {
      setInputdata((prev) => ({
        ...prev,
        contact: { ...prev.contact, [name]: value },
      }));
    } else if (type === "checkbox") {
      setInputdata((prev) => ({ ...prev, [name]: checked }));
    } else {
      setInputdata({ ...inputdata, [name]: value });
    }

    // Reset errors on change
    setFirstNameError(false);
    setFirstNameErrorMessage("");
    setLastNameError(false);
    setLastNameErrorMessage("");
    setEmailError(false);
    setEmailErrorMessage("");
    setCountryCodeError(false);
    setCountryCodeErrorMessage("");
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    const { firstName, lastName, emailId, contact, agreement } = inputdata;
    const { countryCode, mobileNumber } = contact;

    const setErrorAndReturn = (setError, setMessage, message) => {
      setError(true);
      setMessage(message);
      return;
    };

    if (!firstName) {
      setErrorAndReturn(
        setFirstNameError,
        setFirstNameErrorMessage,
        "Enter your first name"
      );
    }
    if (!lastName) {
      setErrorAndReturn(
        setLastNameError,
        setLastNameErrorMessage,
        "Enter your last name"
      );
    }
    if (!emailId) {
      setErrorAndReturn(
        setEmailError,
        setEmailErrorMessage,
        "Enter your email ID"
      );
    } else if (!EMAIL_REGEX.test(emailId)) {
      setErrorAndReturn(
        setEmailError,
        setEmailErrorMessage,
        "Enter a valid email ID"
      );
    }
    if (!countryCode) {
      setErrorAndReturn(
        setCountryCodeError,
        setCountryCodeErrorMessage,
        "Enter your country code"
      );
    }
    if (!mobileNumber) {
      setErrorAndReturn(
        setMobileNumberError,
        setMobileNumberErrorMessage,
        "Enter your mobile number"
      );
    }
    if (!agreement) {
      alert("You must agree to the terms and conditions");
      return;
    }

    // Simulated API call (replace with actual API integration)

    const signupData = { ...inputdata };
    delete signupData.agreement;
    // signupData.contact.countryCode = parseInt(
    //   inputdata.contact.countryCode,
    //   10
    // );
    // signupData.contact.mobileNumber = parseInt(
    //   inputdata.contact.mobileNumber,
    //   10
    // );

    // console.log("Submitting data:", signupData);

    try {
      const response = await userSignup(signupData);

      if (
        (response.status === 200 || response.status === 201) &&
        response?.data?.success
      ) {
        localStorage.setItem("ragisterEmail", inputdata.emailId);
        localStorage.setItem("userIdForVerify", response.data.data.userId);
        localStorage.setItem("groupId", response.data.data.groupId);

        setInputdata({
          ...inputdata,
          firstName: "",
          lastName: "",
          emailId: "",
          contact: {
            countryCode: "",
            mobileNumber: "",
          },
          agreement: false,
        });

        navigate("/successModal", {
          state: {
            message:
              "You are successfully registered. A verification link has been sent to your email. Please check your inbox to verify your email address.",
          },
        });
      } else {
        if (response?.status !== 404) {
          toast.error(
            response?.response?.data?.error?.message ||
              "Failed to sign up. Please try again."
          );
        }
      }
    } catch (error) {
      if (error?.response?.status !== 404) {
        console.error("Sign-up error:", error);
        toast.error("An error occurred during sign-up.");
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
          <h3>Create Account</h3>
          <p>Please sign-up to your account and start the Follow-Up</p>
        </div>
        <div className="mb-3">
          <label className="form-label">
            FIRST NAME <span className="star">*</span>
          </label>
          <input
            style={{ borderColor: firstNameError ? "red" : "#90909A" }}
            type="text"
            name="firstName"
            className="form-control"
            onChange={handleChange}
          />
          {firstNameErrorMessage && (
            <p className="error-message">{firstNameErrorMessage}</p>
          )}
        </div>
        <div className="mb-3">
          <label className="form-label">
            LAST NAME <span className="star">*</span>
          </label>
          <input
            style={{ borderColor: lastNameError ? "red" : "#90909A" }}
            type="text"
            name="lastName"
            className="form-control"
            onChange={handleChange}
          />
          {lastNameErrorMessage && (
            <p className="error-message">{lastNameErrorMessage}</p>
          )}
        </div>
        <div className="mb-3">
          <label className="form-label">
            EMAIL ID <span className="star">*</span>
          </label>
          <input
            style={{ borderColor: emailError ? "red" : "#90909A" }}
            type="email"
            name="emailId"
            className="form-control"
            onChange={handleChange}
          />
          {emailErrorMessage && (
            <p className="error-message">{emailErrorMessage}</p>
          )}
        </div>
        <div className="mb-3">
          <label className="form-label">
            MOBILE NUMBER <span className="star">*</span>
          </label>
          <div className="d-flex">
            <select
              style={{
                borderColor: countryCodeError ? "red" : "#90909A",
                maxWidth: "100px",
              }}
              className="form-select me-2"
              name="countryCode"
              value={inputdata.contact.countryCode || "+91"}
              onChange={handleChange}
            >
              <option value="">Select</option>
              <option value="+1">+1 (USA)</option>
              <option value="+91">+91 (India)</option>
              <option value="+44">+44 (UK)</option>
              <option value="+61">+61 (Australia)</option>
              <option value="+81">+81 (Japan)</option>
              <option value="+49">+49 (Germany)</option>
            </select>
            <input
              style={{ borderColor: mobileNumberError ? "red" : "#90909A" }}
              type="text"
              className="form-control"
              name="mobileNumber"
              value={inputdata.contact.mobileNumber}
              onChange={handleChange}
            />
          </div>
          {countryCodeErrorMessage && (
            <p className="error-message">{countryCodeErrorMessage}</p>
          )}
          {mobileNumberErrorMessage && (
            <p className="error-message">{mobileNumberErrorMessage}</p>
          )}
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              name="agreement"
              checked={inputdata.agreement}
              onChange={handleChange}
            />{" "}
            I agree to the
            <a href="/terms-of-service" target="_blank">
              {" "}
              Terms of Service
            </a>
            ,{" "}
            <a href="/privacy-policy" target="_blank">
              Privacy Policy
            </a>
            , and{" "}
            <a href="/refund-policy" target="_blank">
              Refund Policy
            </a>
            .
          </label>
        </div>
        <div className="center">
          <button type="submit" className="btn btn-dark" onClick={handleSignUp}>
            Sign Up
          </button>
        </div>
        <div className="center">
          <Link to="/login" className="mt-5 mb-4">
            Back to Login
          </Link>
        </div>
      </form>
    </div>
  );
}

export default SignUp;
