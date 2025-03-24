import React from "react";
import LMlogo from "../assets/img/LMlogo.png";
import { useLocation, useNavigate } from "react-router-dom";

function SuccesModal() {
  const navigate = useNavigate();
  const location = useLocation();
  const { message } = location.state || { message: "No message provided." };
  // const handleSignIn = (event) => {
  //   event.preventDefault(); // Prevent form submission
  //   navigate("/login"); // Navigate to the login page
  // };
  return (
    <div className="loginBox">
      <form>
        <div className="center mb-4">
          <img src={LMlogo} alt="" />
        </div>
        <div className="center">
          <h3>Lead Management System</h3>
        </div>
        <div className="mb-3">
          <div className="successIcon">
            <i className="fa fa-check" aria-hidden="true"></i>
          </div>
        </div>
        <div className="mb-3 center">
          <p>{message}</p>
        </div>

        {/* <div className="center">
          <button type="submit" className="btn btn-dark" onClick={handleSignIn}>
            Sign In
          </button>
        </div> */}
      </form>
    </div>
  );
}

export default SuccesModal;
