import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../store/auth/auth-context";
import LMlogo from "../assets/img/LMlogo.png";
import { toast, ToastContainer } from "react-toastify";

import { EMAIL_REGEX } from "../utils/regex"; // Ensure this regex is correct
import { forgotpassword } from "../services/userService";

function ForgotPassword() {
  const navigate = useNavigate();
  const userdata = useContext(AuthContext);
  const [inputdata, setInputdata] = useState({ emailId: "" });
  const [emailError, setEmailError] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputdata({ ...inputdata, [name]: value });
    setEmailError(false);
    setEmailErrorMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { emailId } = inputdata;

    // Validation for email
    if (!emailId) {
      setEmailError(true);
      setEmailErrorMessage("Enter your email");
      return;
    }

    if (!EMAIL_REGEX.test(emailId)) {
      setEmailError(true);
      setEmailErrorMessage("Enter a valid email address");
      return;
    }

    // API Call for forgot password
    try {
      const response = await forgotpassword(inputdata);

      if (response.status === 200 && response.data?.success) {
        toast.success("Password recovery email sent successfully!");
        setInputdata({ emailId: "" });

        userdata.logout();
        localStorage.setItem("userIdForVerify", response.data.data.userId);
        localStorage.setItem("groupId", response.data.data.groupId);
        setTimeout(() => navigate("/resetPassword"), 3000); // Navigate after showing the toast
      } else {
        if (response?.status !== 404) {
          toast.error(
            response?.response?.data?.error?.message ||
              "Failed to send password recovery email."
          );
        }
      }
    } catch (error) {
      if (error?.response?.status !== 404) {
        console.error("Error:", error);
        toast.error(error.message || "Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div className="loginBox">
      {/* Toast Container */}
      <ToastContainer position="top-right" autoClose={1000} />
      <form onSubmit={handleSubmit}>
        <div className="center mb-4">
          <img src={LMlogo} alt="Logo" />
        </div>
        <div className="center">
          <h3>Forgot Password</h3>
          <p>Please enter your email to recover your password</p>
        </div>
        <div className="mb-3">
          <label htmlFor="emailId" className="form-label">
            EMAIL ID
          </label>
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
          <p className="error-message" style={{ color: "red" }}>
            {emailErrorMessage}
          </p>
        )}
        <div className="center">
          <button
            type="submit"
            className="btn btn-dark"
            disabled={!inputdata.emailId}
          >
            Submit
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

export default ForgotPassword;
