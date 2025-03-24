import React, { useContext, useState } from "react";
import LMlogo from "../assets/img/LMlogo.png";
import { useNavigate } from "react-router-dom";
import { changePassword } from "../services/userService";
import AuthContext from "../store/auth/auth-context";
import { toast, ToastContainer } from "react-toastify";

function ChangePassword() {
  const userdata = useContext(AuthContext);
  const navigate = useNavigate();
  const [inputdata, setInputdata] = useState({
    oldPassword: "",
    newPassword: "",
  });
  const [oldPasswordError, setOldPasswordError] = useState(false);
  const [oldPasswordMessage, setOldPasswordMessage] = useState("");
  const [newPasswordError, setNewPasswordError] = useState(false);
  const [newPasswordMessage, setNewPasswordErrorMessage] = useState("");
  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputdata({ ...inputdata, [name]: value });
    setOldPasswordError(false);
    setOldPasswordMessage("");
    setNewPasswordError(false);
    setNewPasswordErrorMessage("");
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    const { oldPassword, newPassword } = inputdata;

    if (oldPassword === "" && newPassword === "") {
      setErrorAndReturn(setOldPasswordError, "Enter your old password");
      setErrorAndReturn(setNewPasswordError, "Enter your new password");
    } else if (oldPassword === "") {
      setErrorAndReturn(setOldPasswordError, "Enter your old password");
    } else if (newPassword === "") {
      setErrorAndReturn(setNewPasswordError, "Enter your new password");
    } else {
      try {
        const response = await changePassword(inputdata);

        if (response.status === 200 && response.data?.success) {
          toast.success("Password changed successfully. Please log in again.");
          setInputdata({ oldPassword: "", newPassword: "" });
          userdata.logout();
          setTimeout(() => navigate("/login"), 3000); // Navigate after showing the toast
        } else {
          if (response?.status !== 404) {
            toast.error(
              response?.response?.data?.error?.message ||
                "Failed to change password. Please try again."
            );
          }
        }
      } catch (error) {
        if (error?.response?.status !== 404) {
          console.error("Error:", error);
          toast.error(
            error.message || "Something went wrong. Please try again."
          );
        }
      }
    }
  };

  return (
    <div className="loginBox">
      {/* Toast Container */}
      <ToastContainer position="top-right" autoClose={1000} />

      <form>
        <div className="center mb-4">
          <img src={LMlogo} alt="" />
        </div>
        <div className="center">
          <h3>Change Password</h3>
          <p>Please Change Password to your account and start the Follow-Up</p>
        </div>
        <div className="mb-3">
          <label htmlFor="exampleInputEmail1" className="form-label">
            OLD PASSWORD
          </label>
          <input
            style={{ borderColor: oldPasswordError ? "red" : "#90909A" }}
            type="text"
            name="oldPassword"
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        {oldPasswordMessage && (
          <p className="error-message">{oldPasswordMessage}</p>
        )}

        <div className="mb-3">
          <label htmlFor="exampleInputPassword1" className="form-label">
            New PASSWORD
          </label>
          <input
            style={{ borderColor: newPasswordError ? "red" : "#90909A" }}
            type="password"
            name="newPassword"
            className="form-control"
            id="exampleInputPassword1"
            onChange={handleChange}
            required
          />
        </div>
        {newPasswordMessage && (
          <p className="error-message">{newPasswordMessage}</p>
        )}

        <div className="center">
          <button
            type="submit"
            className="btn btn-dark"
            onClick={handleLoginSubmit}
            disabled={!(inputdata.oldPassword && inputdata.newPassword)} // Disable button if email or password is empty
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}

export default ChangePassword;
