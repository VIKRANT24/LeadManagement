import { commonrequest } from "./main";
import { apiServicesEnum } from "../utils/apiServiceEnum";

const BACKEND_URL = import.meta.env.VITE_APP_BASE_URL_LEAD;

export const preparePayload = (data) => {
  return {
    checksum: "string",
    data,
  };
};

// Contact Services
export const getContacts = async () => {
  const url = `${BACKEND_URL}/contact`;
  return await commonrequest("GET", url, null, apiServicesEnum.LEAD_SERVICE);
};

export const postContact = async (data) => {
  const payload = preparePayload(data);
  return await commonrequest(
    "POST",
    `${BACKEND_URL}/contact`,
    payload,
    apiServicesEnum.LEAD_SERVICE
  );
};

export const getContactById = async (contactId) => {
  return await commonrequest(
    "GET",
    `${BACKEND_URL}/contact/${contactId}`,
    null,
    apiServicesEnum.LEAD_SERVICE
  );
};

export const updateContactById = async (contactId, data) => {
  const payload = preparePayload(data);
  return await commonrequest(
    "PATCH",
    `${BACKEND_URL}/contact/${contactId}`,
    payload,
    apiServicesEnum.LEAD_SERVICE
  );
};

// Reference Services
export const getReference = async () => {
  const url = `${BACKEND_URL}/reference`;
  return await commonrequest("GET", url, null, apiServicesEnum.LEAD_SERVICE);
};

export const postReference = async (data) => {
  const payload = preparePayload(data);
  return await commonrequest(
    "POST",
    `${BACKEND_URL}/reference`,
    payload,
    apiServicesEnum.LEAD_SERVICE
  );
};

export const getReferenceById = async (referenceId) => {
  return await commonrequest(
    "GET",
    `${BACKEND_URL}/reference/${referenceId}`,
    null,
    apiServicesEnum.LEAD_SERVICE
  );
};

export const updateReferenceById = async (referenceId, data) => {
  const payload = preparePayload(data);
  return await commonrequest(
    "PATCH",
    `${BACKEND_URL}/reference/${referenceId}`,
    payload,
    apiServicesEnum.LEAD_SERVICE
  );
};

// Leads Services
export const getLeadsSearch = async (data) => {
  const payload = preparePayload(data);
  return await commonrequest(
    "POST",
    `${BACKEND_URL}/leads/search`,
    payload,
    apiServicesEnum.LEAD_SERVICE
  );
};

export const postNewLeads = async (data) => {
  const payload = preparePayload(data);
  return await commonrequest(
    "POST",
    `${BACKEND_URL}/leads/new`,
    payload,
    apiServicesEnum.LEAD_SERVICE
  );
};

export const getLeadById = async (leadId) => {
  return await commonrequest(
    "GET",
    `${BACKEND_URL}/leads/details/${leadId}`,
    null,
    apiServicesEnum.LEAD_SERVICE
  );
};

export const updateLeadById = async (leadId, data) => {
  const payload = preparePayload(data);
  return await commonrequest(
    "PATCH",
    `${BACKEND_URL}/leads/details/${leadId}`,
    payload,
    apiServicesEnum.LEAD_SERVICE
  );
};

// Leads Services
export const getFollowups = async (leadId) => {
  return await commonrequest(
    "GET",
    `${BACKEND_URL}/leads/followups/${leadId}`,
    null,
    apiServicesEnum.LEAD_SERVICE
  );
};

export const postFollowups = async (leadId, data) => {
  const payload = preparePayload(data);
  return await commonrequest(
    "POST",
    `${BACKEND_URL}/leads/followups/${leadId}`,
    payload,
    apiServicesEnum.LEAD_SERVICE
  );
};

export const getFollowupsById = async (leadId, leadFollowupId) => {
  return await commonrequest(
    "GET",
    `${BACKEND_URL}/leads/followups/${leadId}/${leadFollowupId}`,
    null,
    apiServicesEnum.LEAD_SERVICE
  );
};

export const updateFollowupsById = async (leadId, leadFollowupId, data) => {
  const payload = preparePayload(data);
  return await commonrequest(
    "PATCH",
    `${BACKEND_URL}/leads/followups/${leadId}/${leadFollowupId}`,
    payload,
    apiServicesEnum.LEAD_SERVICE
  );
};

// Leads source Services
export const getLeadsSource = async (data) => {
  const payload = preparePayload(data);
  return await commonrequest(
    "GET",
    `${BACKEND_URL}/leads/source`,
    payload,
    apiServicesEnum.LEAD_SERVICE
  );
};

export const postLeadsSource = async (data) => {
  const payload = preparePayload(data);
  return await commonrequest(
    "POST",
    `${BACKEND_URL}/leads/source`,
    payload,
    apiServicesEnum.LEAD_SERVICE
  );
};

export const getLeadsSourceById = async (leadSourceId) => {
  return await commonrequest(
    "GET",
    `${BACKEND_URL}/leads/source/${leadSourceId}`,
    null,
    apiServicesEnum.LEAD_SERVICE
  );
};

export const updateLeadsSourceById = async (leadSourceId, data) => {
  const payload = preparePayload(data);
  return await commonrequest(
    "PATCH",
    `${BACKEND_URL}/leads/source/${leadSourceId}`,
    payload,
    apiServicesEnum.LEAD_SERVICE
  );
};

// Leads Tag Services
export const getLeadsTag = async (data) => {
  const payload = preparePayload(data);
  return await commonrequest(
    "POST",
    `${BACKEND_URL}/leads/tag/search`,
    payload,
    apiServicesEnum.LEAD_SERVICE
  );
};

export const postLeadsTag = async (data) => {
  const payload = preparePayload(data);
  return await commonrequest(
    "POST",
    `${BACKEND_URL}/leads/tag/new`,
    payload,
    apiServicesEnum.LEAD_SERVICE
  );
};

export const getLeadsTagById = async (leadTagId) => {
  return await commonrequest(
    "GET",
    `${BACKEND_URL}/leads/tag/${leadTagId}`,
    null,
    apiServicesEnum.LEAD_SERVICE
  );
};

export const updateLeadsTagById = async (leadTagId, data) => {
  const payload = preparePayload(data);
  return await commonrequest(
    "PATCH",
    `${BACKEND_URL}/leads/tag/${leadTagId}`,
    payload,
    apiServicesEnum.LEAD_SERVICE
  );
};

// Leads Tag Services
export const getLeadsStatus = async (data) => {
  const payload = preparePayload(data);
  return await commonrequest(
    "POST",
    `${BACKEND_URL}/leads/status/search`,
    payload,
    apiServicesEnum.LEAD_SERVICE
  );
};

export const postLeadsStatus = async (data) => {
  const payload = preparePayload(data);
  return await commonrequest(
    "POST",
    `${BACKEND_URL}/leads/status/new`,
    payload,
    apiServicesEnum.LEAD_SERVICE
  );
};

export const getLeadsStatusById = async (leadStatusId) => {
  return await commonrequest(
    "GET",
    `${BACKEND_URL}/leads/status/${leadStatusId}`,
    null,
    apiServicesEnum.LEAD_SERVICE
  );
};

export const updateLeadsStatusById = async (leadStatusId, data) => {
  const payload = preparePayload(data);
  return await commonrequest(
    "PATCH",
    `${BACKEND_URL}/leads/status/${leadStatusId}`,
    payload,
    apiServicesEnum.LEAD_SERVICE
  );
};

//Search transfered leads
export const postSearchLeads = async (data) => {
  const payload = preparePayload(data);
  return await commonrequest(
    "POST",
    `${BACKEND_URL}/leads/transfer`,
    payload,
    apiServicesEnum.LEAD_SERVICE
  );
};

export const putLeadsTransfered = async (data) => {
  const payload = preparePayload(data);
  return await commonrequest(
    "PUT",
    `${BACKEND_URL}/leads/transfer`,
    payload,
    apiServicesEnum.LEAD_SERVICE
  );
};

//Search dashboard Data
export const postDashboard = async (data) => {
  const payload = preparePayload(data);
  return await commonrequest(
    "POST",
    `${BACKEND_URL}/dashboard/summary`,
    payload,
    apiServicesEnum.LEAD_SERVICE
  );
};
