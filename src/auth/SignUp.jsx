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


            <div className="auth-main" >
                <div className="auth-wrapper v3">
                    <div className="auth-form" style={{ backgroundColor: "#f4f3ef" }}>
                        <div className="card mt-5">
                            <div className="card-body">
                                <a href="#" className="d-flex justify-content-center mt-3">
                                    <img src={LMlogo} alt="image" />{/*className="img-fluid brand-logo" */}
                                </a>
                                {/*<div className="row">*/}
                                {/*    <div className="d-flex justify-content-center">*/}
                                {/*        <div className="auth-header">*/}
                                {/*            <h2 className="text-secondary mt-5"><b>Sign up</b></h2>*/}
                                {/*            <p className="f-16 mt-2">Enter your credentials to continue</p>*/}
                                {/*        </div>*/}
                                {/*    </div>*/}
                                {/*</div>*/}
                                {/*<button type="button" className="btn mt-2 bg-light-primary bg-light text-muted" style={{width: '100%'}}>*/}
                                {/*    <img src="/src/assets/img/google-icon.svg" alt="image" />Sign Up With Google*/}
                                {/*</button>*/}

                                {/*<div className="saprator mt-3">*/}
                                {/*    <span>or</span>*/}
                                {/*</div>*/}
                                <h5 className="my-4 d-flex justify-content-center">Sign Up with Email address</h5>
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-floating mb-3">
                                            <input style={{ borderColor: firstNameError ? "red" : "#90909A" }}
                                                type="text"
                                                name="firstName"
                                                id="firstName"
                                                className="form-control"
                                                onChange={handleChange}
                                                placeholder="First Name" />
                                            <label htmlFor="firstName">First Name</label>
                                            {firstNameErrorMessage && (
                                                <p className="error-message">{firstNameErrorMessage}</p>
                                            )}
                                        </div>
                                       
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-floating mb-3">
                                            <input
                                                style={{ borderColor: lastNameError ? "red" : "#90909A" }}
                                                type="text"
                                                name="lastName"
                                                id="lastName"
                                                className="form-control"
                                                onChange={handleChange}
                                                placeholder="Last Name" />
                                            <label htmlFor="lastName">Last Name</label>
                                            {lastNameErrorMessage && (
                                                <p className="error-message">{lastNameErrorMessage}</p>
                                            )}
                                        </div>
                                      
                                    </div>
                                </div>
                                <div className="form-floating mb-3">
                                    <input
                                        style={{ borderColor: emailError ? "red" : "#90909A" }}
                                        type="email"
                                        name="emailId"
                                        id="emailId"
                                        className="form-control"
                                        onChange={handleChange}
                                        placeholder="Email Address / Username" />
                                    <label htmlFor="emailId">Email Address / Username</label>
                                    {emailErrorMessage && (
                                        <p className="error-message">{emailErrorMessage}</p>
                                    )}
                                </div>
                                {/*<div className="form-floating mb-3">*/}
                                {/*    <input type="email" className="form-control" id="floatingInput3" placeholder="Password" />*/}
                                {/*    <label htmlFor="floatingInput3">Password</label>*/}
                                {/*</div>*/}

                              
                                    <div className="row">
                                        <div className="form-floating mb-3 col-4">
                                            <select
                                                style={{
                                                    borderColor: countryCodeError ? "red" : "#90909A",
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
                                            {countryCodeErrorMessage && (
                                                <p className="error-message">{countryCodeErrorMessage}</p>
                                            )}
                                        </div>
                                        <div className="form-floating mb-3 col-8">
                                            <input
                                                style={{ borderColor: mobileNumberError ? "red" : "#90909A" }}
                                                type="text"
                                                className="form-control"
                                                name="mobileNumber"
                                                id="mobileNumber"
                                                value={inputdata.contact.mobileNumber}
                                                onChange={handleChange}
                                                placeholder="Mobile Number" />
                                        <label htmlFor="mobileNumber" style={{ left:"10px" }}>Mobile Number</label>
                                            {mobileNumberErrorMessage && (
                                                <p className="error-message">{mobileNumberErrorMessage}</p>
                                            )}
                                        </div>
                                    </div>
                               

                                <div className="form-check mt-3s">
                                    <input className="form-check-input input-primary" type="checkbox"
                                        name="agreement"
                                        id="agreement"
                                        checked={inputdata.agreement}
                                        onChange={handleChange} />
                                    <label className="form-check-label" htmlFor="customCheckc1">
                                        <span className="h5 mb-0">
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
                                        </span>
                                    </label>
                                </div>
                                <div className="d-grid mt-4">
                                    <button type="submit" onClick={handleSignUp} className="btn btn-secondary p-2">Sign Up</button>
                                </div>
                                <hr />
                                <h5 className="d-flex justify-content-center">
                                    <a href="/login" style={{ color:"#343a40"}}>
                                        Already have an account?
                                    </a>
                                </h5>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default SignUp;
