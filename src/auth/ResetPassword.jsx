import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../store/auth/auth-context";
import LMlogo from "../assets/img/LMlogo.png";
import { toast, ToastContainer } from "react-toastify";
import { resetPassword } from "../services/userService";

function ResetPassword() {
  const navigate = useNavigate();
  const userdata = useContext(AuthContext);

  const [inputdata, setInputdata] = useState({
    password: "",
    code: "",
    userId: parseInt(localStorage.getItem("userIdForVerify") || "0", 10),
  });
  const [passwordError, setPasswordError] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
  const [codeError, setCodeError] = useState(false);
  const [codeErrorMessage, setCodeErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputdata({ ...inputdata, [name]: value });
    setPasswordError(false);
    setPasswordErrorMessage("");
    setCodeError(false);
    setCodeErrorMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { password, code } = inputdata;

    // Validation
    if (!password) {
      setPasswordError(true);
      setPasswordErrorMessage("Enter your password");
      return;
    }
    if (!code) {
      setCodeError(true);
      setCodeErrorMessage("Enter your code");
      return;
    }

    // API Call
    try {
      const response = await resetPassword(inputdata);

      if (response.status === 200 && response.data?.success) {
        toast.success("Password reset successfully!");
        setInputdata({ password: "", code: "" });
        localStorage.removeItem("userIdForVerify");
        localStorage.removeItem("groupId");
        userdata.logout();
        setTimeout(() => navigate("/login"), 3000); // Redirect after success
      } else {
        if (response?.status !== 404) {
          toast.error(
            response?.response?.data?.error?.message ||
              "Failed to reset password. Try again."
          );
        }
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <div className="loginBox">
      <ToastContainer position="top-right" autoClose={1000} />
      <form onSubmit={handleSubmit}>
        <div className="center mb-4">
          <img src={LMlogo} alt="Logo" />
        </div>
        <div className="center">
          <h3>Reset Password</h3>
          <p>Please reset your password</p>
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            PASSWORD
          </label>
          <input
            style={{ borderColor: passwordError ? "red" : "#90909A" }}
            type="password"
            name="password"
            value={inputdata.password}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        {passwordErrorMessage && (
          <p className="error-message" style={{ color: "red" }}>
            {passwordErrorMessage}
          </p>
        )}
        <div className="mb-3">
          <label htmlFor="code" className="form-label">
            CODE
          </label>
          <input
            style={{ borderColor: codeError ? "red" : "#90909A" }}
            type="text"
            name="code"
            value={inputdata.code}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        {codeErrorMessage && (
          <p className="error-message" style={{ color: "red" }}>
            {codeErrorMessage}
          </p>
        )}
        <div className="center">
          <button
            type="submit"
            className="btn btn-dark"
            disabled={!inputdata.password || !inputdata.code}
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

export default ResetPassword;
