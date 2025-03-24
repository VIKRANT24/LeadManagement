import React, { useState } from "react";

const AuthContext = React.createContext({
  token: "",
  refresh: "",
  username: "",
  firstName: "",
  lastName: "",
  email: "",
  status: "",
  groupId: "",
  organization: "",
  isLoggedIn: false,
  userdata: (token) => {},
  login: (token) => {},
  logout: () => {},
});

export const AuthContextProvider = (props) => {
  const initialToken = localStorage.getItem("token");
  const [token, setToken] = useState(initialToken);
  const initialrefresh = localStorage.getItem("refresh");
  const [refresh, setrefresh] = useState(initialrefresh);
  const initialUserName = localStorage.getItem("nickName");
  const [username, setUsername] = useState(initialUserName);

  const initialEmail = localStorage.getItem("email");
  const [email, setEmail] = useState(initialEmail);
  const initialFirstName = localStorage.getItem("firstName");
  const [firstName, setFirstName] = useState(initialFirstName);
  const initialLastName = localStorage.getItem("lastName");
  const [lastName, setLastName] = useState(initialLastName);
  // const initialOrganization = localStorage.getItem("organization");
  // const [organization, setOrganization] = useState(initialOrganization);
  const initialStatus = localStorage.getItem("status");
  const [status, setStatus] = useState(initialStatus);
  const initialGroupId = localStorage.getItem("groupId");
  const [groupId, setGroupId] = useState(initialGroupId);
  const initialUserId = localStorage.getItem("userId");
  const initialIsAdmin = localStorage.getItem("isAdmin");
  const [isAdmin, setIsAdmin] = useState(initialIsAdmin);
  const [otp, setOtp] = useState(false);
  const [userId, setUserId] = useState(initialUserId);
  const userIsLoggedIn = !!token;
  const otpVerifyHandler = (bool) => {
    setOtp(bool);
  };
  const userDataHandler = (
    email,
    firstName,
    lastName,
    status,
    groupId,
    userId,
    isAdmin
  ) => {
    setEmail(email);
    setFirstName(firstName);
    setLastName(lastName);
    setStatus(status);
    setGroupId(groupId);
    setUserId(userId);
    setIsAdmin(isAdmin);

    localStorage.setItem("email", email);
    localStorage.setItem("firstName", firstName);
    localStorage.setItem("lastName", lastName);
    localStorage.setItem("status", status);
    localStorage.setItem("groupId", groupId);
    localStorage.setItem("userId", userId);
    localStorage.setItem("isAdmin", isAdmin);
  };

  const loginHandler = (token, refresh) => {
    setToken(token);
    setrefresh(refresh);
    localStorage.setItem("token", token);
    localStorage.setItem("refresh", refresh);
  };

  const logoutHandler = () => {
    setToken(null);
    localStorage.removeItem("token");
    setrefresh(null);
    localStorage.removeItem("refresh");
    setUsername(null);
    setEmail(null);
    localStorage.removeItem("email");
    setFirstName(null);
    localStorage.removeItem("firstName");
    setLastName(null);
    localStorage.removeItem("lastName");
    setStatus(null);
    localStorage.removeItem("status");
    setGroupId(null);
    localStorage.removeItem("groupId");
    setUserId(null);
    localStorage.removeItem("userId");
    setUserId(null);
    localStorage.removeItem("ragisterEmail");
    localStorage.removeItem("stream");
    localStorage.removeItem("isAdmin");
    setIsAdmin(null);
  };

  const contextValue = {
    token: token,
    refresh: refresh,
    username: username,
    email: email,
    firstName: firstName,
    lastName: lastName,
    userId: userId,
    status: status,
    groupId: groupId,
    otp: otp,

    // organization: organization,
    isLoggedIn: userIsLoggedIn,
    login: loginHandler,
    logout: logoutHandler,
    userdata: userDataHandler,
    otpverify: otpVerifyHandler,
  };

  // console.log("contextValue", contextValue);

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
