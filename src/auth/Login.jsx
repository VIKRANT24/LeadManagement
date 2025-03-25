import React, { useContext, useState } from "react";
import LMlogo from "../assets/img/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { resendVerficationCode, userLogin } from "../services/userService";
import AuthContext from "../store/auth/auth-context";
import { EMAIL_REGEX } from "../utils/regex";
import { ToastContainer, toast } from "react-toastify";
import { Eye, EyeOff } from "lucide-react";

function Login() {
  const navigate = useNavigate();
  const auth = useContext(AuthContext);
  const [inputdata, setInputdata] = useState({
    emailId: "",
    password: "",
    device: "WEB",
  });
  const [emailError, setEmailError] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputdata({ ...inputdata, [name]: value });
    setEmailError(false);
    setEmailErrorMessage("");
    setPasswordError(false);
    setPasswordErrorMessage("");
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    const { emailId, password } = inputdata;

    const setErrorAndReturn = (field, message) => {
      field(true);
      field === setEmailError
        ? setEmailErrorMessage(message)
        : setPasswordErrorMessage(message);
      return;
    };

    if (emailId === "" && password === "") {
      setErrorAndReturn(setEmailError, "Enter your email");
      setErrorAndReturn(setPasswordError, "Enter your password");
    } else if (emailId === "") {
      setErrorAndReturn(setEmailError, "Enter your email");
    } else if (password === "") {
      setErrorAndReturn(setPasswordError, "Enter your password");
    } else if (password.includes(" ")) {
      setErrorAndReturn(
        setPasswordError,
        "Password should not contain blank spaces"
      );
    } else if (!EMAIL_REGEX.test(emailId)) {
      setErrorAndReturn(setEmailError, "Enter valid email");
    } else if (/\s/.test(password)) {
      setErrorAndReturn(setPasswordError, "Password should not contain spaces");
    } else {
      try {
        const response = await userLogin(inputdata);

        if (response.status === 200) {
          if (!response?.data?.success) {
            // console.error("Error during login:", response);

            toast.error(response?.data?.error?.message || "Login failed");
          } else if (response?.data?.data?.userDetails?.status === "PENDING") {
            localStorage.setItem(
              "userId",
              response?.data?.data?.userDetails?.userId
            );
            localStorage.setItem(
              "groupId",
              response?.data?.data?.groupDetails?.groupId
            );
            toast.error(
              "Your email is not verified. Please check your registered email for the verification link, verify your email, and log in again to continue."
            );
            setTimeout(() => {
              handleResendCodeSubmit();
            }, 3000);
          } else {
            toast.success("Password recovery email sent successfully!");
            auth.login(
              response.data?.data?.tokens?.accessToken,
              response.data?.data?.tokens?.refreshToken
            );
            auth.userdata(
              response?.data?.data?.userDetails?.emailId,
              response?.data?.data?.userDetails?.firstName,
              response?.data?.data?.userDetails?.lastName,
              response?.data?.data?.userDetails?.status,
              response?.data?.data?.groupDetails?.groupId,
              response.data?.data?.userDetails?.userId,
              response.data?.data?.userDetails?.isAdminUser
            );
            setInputdata({ ...inputdata, emailId: "", password: "" });

            if (response?.data?.data?.userDetails?.forcePasswordChange) {
              navigate("/changePassword");
            } else {
              navigate("/admin/dashboard");
            }
          }
        } else {
          // console.error("Error during login:", response);
          if (response?.status !== 404) {
            toast.error(
              response?.response?.data?.error?.message || "Login failed"
            );
          }
        }
      } catch (error) {
        // console.error("Error during login:", error);
        if (error?.response?.status !== 404) {
          console.error("Error:", error);
          toast.error(error?.message || "An error occurred. Please try again.");
        }
      }
    }
  };

  //Resend verifyCode
  const handleResendCodeSubmit = async (e) => {
    if (e) e.preventDefault();

    const payload = {
      purpose: "VERIFY_ACCOUNT",
      userId: parseInt(localStorage.getItem("userId") || "0", 10),
    };

    console.log(payload);

    try {
      const response = await resendVerficationCode(payload);
      if (response.status === 200) {
        if (response?.data?.success) {
          localStorage.removeItem("userId");
          localStorage.removeItem("groupId");
          setInputdata({ ...inputdata, emailId: "", password: "" });
          toast.success("Verification code resent successfully!");
        } else {
          toast.error("Failed to resend the verification code.");
        }
      } else {
        toast.error("Unexpected error occurred. Please try again.");
        localStorage.removeItem("userId");
        localStorage.removeItem("groupId");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
      console.error(error);
    } finally {
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
 
   
      <div class="auth-main loginBox">
           {/* Toast Container */}
      <ToastContainer position="top-right" autoClose={1000} />
      <div class="auth-wrapper v3">
        <div class="auth-form" style={{backgroundColor:'rgb(238, 242, 246)'}}>
          <div class="card my-5">
            <div class="card-body">
              <a href="#" class="d-flex justify-content-center">
                <img src={LMlogo} alt="image" class="img-fluid brand-logo vss-img" />
              </a>
              <div class="row">
                <div class="d-flex justify-content-center">
                  <div class="auth-header">
                    <h2 class="text-secondary mt-5"><b>Hi, Welcome Back</b></h2>
                    <p class="f-16 mt-2">Enter your credentials to continue</p>
                  </div>
                </div>
              </div>
              
              <div class="form-floating mb-3">
                <input type="email" class="form-control" id="floatingInput" placeholder="Email address / Username" 
                style={{ borderColor: emailError ? "red" : "#90909A" }}
                name="emailId"
                onChange={handleChange}
                required
                />
                <label for="floatingInput">Email address / Username</label>
              </div>
              {emailErrorMessage && (
          <p className="error-message">{emailErrorMessage}</p>
        )}
              <div class="form-floating mb-3">
                <input class="form-control" id="floatingInput1" placeholder="Password" 
                 style={{
                  borderColor: passwordError ? "red" : "#90909A",
                  paddingRight: "40px",
                }}
                type={showPassword ? "text" : "password"}
                name="password"
                onChange={handleChange}
                required
                />
                 <span
              onClick={togglePasswordVisibility}
              style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                cursor: "pointer",
              }}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </span>
                <label for="floatingInput1">Password</label>
              </div>
              <div class="d-flex mt-1 justify-content-between">
                <div class="form-check" style={{visibility:'hidden'}}>
                  <input class="form-check-input input-primary" type="checkbox" id="customCheckc1" checked="" />
                  <label class="form-check-label text-muted" for="customCheckc1">Remember me</label>
                </div>
                {/* <h5 class="text-secondary">Forgot Password?</h5> */}
                <Link
            to="/ForgotPassword"
            className="text-secondary text-decoration-none"
          >
            Forgot Password?
          </Link>
              </div>
              <div class="d-grid mt-4">
                <button type="submit" class="btn btn-secondary"
                  onClick={handleLoginSubmit}
                  disabled={!(inputdata.emailId && inputdata.password)}
                >Sign In</button>
              </div>
              <hr />
              {/* <h5 class="d-flex justify-content-center">Don't have an account?</h5> */}
              <Link to="/signUp" className="text-decoration-none d-flex justify-content-center"  style={{color:"#343a40"}}>
              Don't have an account?
          </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
   
  );
}

export default Login;
