import { commonrequest } from "./main";
import { apiServicesEnum } from "../utils/apiServiceEnum";

const BACKEND_URL = import.meta.env.VITE_APP_BASE_URL_MSTER;
// console.log("BACKEND_URL", BACKEND_URL);

export const preparePayload = (data) => {
  return {
    checksum: "string",
    data,
  };
};

// Role Services
export const getRoles = async () => {
  const url = `${BACKEND_URL}/master/role`;
  return await commonrequest("GET", url, null, apiServicesEnum.MSTER_SERVICE);
};

export const postRole = async (data) => {
  const payload = preparePayload(data);
  return await commonrequest(
    "POST",
    `${BACKEND_URL}/master/role`,
    payload,
    apiServicesEnum.MSTER_SERVICE
  );
};

export const getRoleById = async (roleId) => {
  return await commonrequest(
    "GET",
    `${BACKEND_URL}/master/role/${roleId}`,
    null,
    apiServicesEnum.MSTER_SERVICE
  );
};

export const updateRoleById = async (roleId, data) => {
  const payload = preparePayload(data);
  return await commonrequest(
    "PATCH",
    `${BACKEND_URL}/master/role/${roleId}`,
    payload,
    apiServicesEnum.MSTER_SERVICE
  );
};

// Designations Services
export const getDesignations = async () => {
  const url = `${BACKEND_URL}/master/designation`;
  return await commonrequest("GET", url, null, apiServicesEnum.MSTER_SERVICE);
};

export const postDesignation = async (data) => {
  const payload = preparePayload(data);
  return await commonrequest(
    "POST",
    `${BACKEND_URL}/master/designation`,
    payload,
    apiServicesEnum.MSTER_SERVICE
  );
};

export const getDesignationById = async (designationId) => {
  return await commonrequest(
    "GET",
    `${BACKEND_URL}/master/designation/${designationId}`,
    null,
    apiServicesEnum.MSTER_SERVICE
  );
};

export const updateDesignationById = async (designationId, data) => {
  const payload = preparePayload(data);
  return await commonrequest(
    "PATCH",
    `${BACKEND_URL}/master/designation/${designationId}`,
    payload,
    apiServicesEnum.MSTER_SERVICE
  );
};

// Organizations Services
export const getOrganizations = async () => {
  const url = `${BACKEND_URL}/master/organization`;
  return await commonrequest("GET", url, null, apiServicesEnum.MSTER_SERVICE);
};

export const postOrganization = async (data) => {
  const payload = preparePayload(data);
  return await commonrequest(
    "POST",
    `${BACKEND_URL}/master/organization`,
    payload,
    apiServicesEnum.MSTER_SERVICE
  );
};

export const getOrganizationById = async (organizationId) => {
  return await commonrequest(
    "GET",
    `${BACKEND_URL}/master/organization/${organizationId}`,
    null,
    apiServicesEnum.MSTER_SERVICE
  );
};

export const updateOrganizationById = async (organizationId, data) => {
  const payload = preparePayload(data);
  return await commonrequest(
    "PATCH",
    `${BACKEND_URL}/master/organization/${organizationId}`,
    payload,
    apiServicesEnum.MSTER_SERVICE
  );
};

// Projects Services
export const getProjects = async (organizationId) => {
  const url = `${BACKEND_URL}/master/project/${organizationId}`;
  return await commonrequest("GET", url, null, apiServicesEnum.MSTER_SERVICE);
};

export const postProject = async (organizationId, data) => {
  const payload = preparePayload(data);
  return await commonrequest(
    "POST",
    `${BACKEND_URL}/master/project/${organizationId}`,
    payload,
    apiServicesEnum.MSTER_SERVICE
  );
};

export const getProjectById = async (organizationId, projectId) => {
  return await commonrequest(
    "GET",
    `${BACKEND_URL}/master/project/${organizationId}/${projectId}`,
    null,
    apiServicesEnum.MSTER_SERVICE
  );
};

export const updateProjectById = async (organizationId, projectId, data) => {
  const payload = preparePayload(data);
  return await commonrequest(
    "PATCH",
    `${BACKEND_URL}/master/project/${organizationId}/${projectId}`,
    payload,
    apiServicesEnum.MSTER_SERVICE
  );
};

// Service Services
export const getServices = async (projectId) => {
  const url = `${BACKEND_URL}/master/service/${projectId}`;
  return await commonrequest("GET", url, null, apiServicesEnum.MSTER_SERVICE);
};

export const postService = async (projectId, data) => {
  const payload = preparePayload(data);
  return await commonrequest(
    "POST",
    `${BACKEND_URL}/master/service/${projectId}`,
    payload,
    apiServicesEnum.MSTER_SERVICE
  );
};

export const getServiceById = async (projectId, serviceId) => {
  return await commonrequest(
    "GET",
    `${BACKEND_URL}/master/service/${projectId}/${serviceId}`,
    null,
    apiServicesEnum.MSTER_SERVICE
  );
};

export const updateServiceById = async (projectId, serviceId, data) => {
  const payload = preparePayload(data);
  return await commonrequest(
    "PATCH",
    `${BACKEND_URL}/master/service/${projectId}/${serviceId}`,
    payload,
    apiServicesEnum.MSTER_SERVICE
  );
};

// user organizations Services
export const getUserOrganizations = async () => {
  const url = `${BACKEND_URL}/user/organizations`;
  return await commonrequest("GET", url, null, apiServicesEnum.MSTER_SERVICE);
};

// user list Services
export const getUserlists = async () => {
  const url = `${BACKEND_URL}/user/list`;
  return await commonrequest("GET", url, null, apiServicesEnum.MSTER_SERVICE);
};
