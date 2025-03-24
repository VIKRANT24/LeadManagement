import { commonrequest } from "./main";
import { apiServicesEnum } from "../utils/apiServiceEnum";

const BACKEND_URL = import.meta.env.VITE_APP_BASE_URL;

export const preparePayload = (data) => {
  return {
    checksum: "string",
    data,
  };
};

export const userLogin = async (data) => {
  const payload = preparePayload(data);
  return await commonrequest(
    "POST",
    `${BACKEND_URL}/auth/login`,
    payload,
    apiServicesEnum.USER_SERVICE
  );
};

export const refreshToken = async (data, obj) => {
  // const payload = preparePayload(data);
  return await commonrequest(
    "POST",
    `${BACKEND_URL}/auth/refresh-token`,
    data,
    apiServicesEnum.USER_SERVICE
  );
};

export const forgotpassword = async (data) => {
  const payload = preparePayload(data);
  return await commonrequest(
    "POST",
    `${BACKEND_URL}/auth/forgot-password`,
    payload,
    apiServicesEnum.USER_SERVICE
  );
};

export const resetPassword = async (data, userId) => {
  const payload = preparePayload(data);
  return await commonrequest(
    "PATCH",
    `${BACKEND_URL}/auth/reset-password`,
    payload,
    apiServicesEnum.USER_SERVICE,
    { " x-user-id": userId }
  );
};

export const userSignup = async (data) => {
  const payload = preparePayload(data);
  return await commonrequest(
    "POST",
    `${BACKEND_URL}/onboarding/admin/register`,
    payload,
    apiServicesEnum.USER_SERVICE
  );
};

export const verifyEmail = async (data) => {
  const payload = preparePayload(data);
  return await commonrequest(
    "POST",
    `${BACKEND_URL}/onboarding/admin/verify-email`,
    payload,
    apiServicesEnum.USER_SERVICE
  );
};

export const resendVerficationCode = async (data) => {
  const payload = preparePayload(data);
  return await commonrequest(
    "POST",
    `${BACKEND_URL}/auth/verification-code/resend`,
    payload,
    apiServicesEnum.USER_SERVICE
  );
};

export const changePassword = async (data) => {
  const payload = preparePayload(data);
  return await commonrequest(
    "PATCH",
    `${BACKEND_URL}/auth/change-password`,
    payload,
    apiServicesEnum.USER_SERVICE
  );
};

export const employeeVerifyEmail = async (data) => {
  const payload = preparePayload(data);
  return await commonrequest(
    "POST",
    `${BACKEND_URL}/onboarding/employee/verify-email`,
    payload,
    apiServicesEnum.USER_SERVICE
  );
};

// Employee Services
export const getEmployeeList = async () => {
  const url = `${BACKEND_URL}/onboarding/employee/list`;
  return await commonrequest("GET", url, null, apiServicesEnum.USER_SERVICE);
};

export const employeeSignup = async (data) => {
  const payload = preparePayload(data);
  return await commonrequest(
    "POST",
    `${BACKEND_URL}/onboarding/employee/register`,
    payload,
    apiServicesEnum.USER_SERVICE
  );
};

export const getEmployeeById = async (userId) => {
  return await commonrequest(
    "GET",
    `${BACKEND_URL}/onboarding/employee/${userId}`,
    null,
    apiServicesEnum.USER_SERVICE
  );
};

export const updateEmployeeById = async (userId, data) => {
  const payload = preparePayload(data);
  return await commonrequest(
    "PATCH",
    `${BACKEND_URL}/onboarding/employee/${userId}`,
    payload,
    apiServicesEnum.USER_SERVICE
  );
};

//Employee Mapping

export const getEmployeeOrg = async (employeeId) => {
  const url = `${BACKEND_URL}/employee/organizations/${employeeId}`;
  return await commonrequest("GET", url, null, apiServicesEnum.USER_SERVICE);
};

export const postEmployeeOrg = async (employeeId, data) => {
  const payload = preparePayload(data);
  return await commonrequest(
    "POST",
    `${BACKEND_URL}/employee/organizations/${employeeId}`,
    payload,
    apiServicesEnum.USER_SERVICE
  );
};

export const getEmployeeProj = async (employeeId) => {
  return await commonrequest(
    "GET",
    `${BACKEND_URL}/employee/projects/${employeeId}`,
    null,
    apiServicesEnum.USER_SERVICE
  );
};

export const postEmployeeProj = async (employeeId, data) => {
  const payload = preparePayload(data);
  return await commonrequest(
    "POST",
    `${BACKEND_URL}/employee/projects/${employeeId}`,
    payload,
    apiServicesEnum.USER_SERVICE
  );
};
