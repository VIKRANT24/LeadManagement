import { commonrequest } from "./main";
import { apiServicesEnum } from "../utils/apiServiceEnum";

const BACKEND_URL = import.meta.env.VITE_APP_BASE_URL_CAMPAIGN;
// console.log("BACKEND_URL", BACKEND_URL);

export const preparePayload = (data) => {
  return {
    checksum: "string",
    data,
  };
};

// Template Services
export const getTemplate = async () => {
  const url = `${BACKEND_URL}/template`;
  return await commonrequest(
    "GET",
    url,
    null,
    apiServicesEnum.CAMPAIGN_SERVICE
  );
};

export const postTemplate = async (data) => {
  const payload = preparePayload(data);
  return await commonrequest(
    "POST",
    `${BACKEND_URL}/template`,
    payload,
    apiServicesEnum.CAMPAIGN_SERVICE
  );
};

export const getTemplateById = async (templateId) => {
  return await commonrequest(
    "GET",
    `${BACKEND_URL}/template/${templateId}`,
    null,
    apiServicesEnum.CAMPAIGN_SERVICE
  );
};

export const updateTemplateById = async (templateId, data) => {
  const payload = preparePayload(data);
  return await commonrequest(
    "PATCH",
    `${BACKEND_URL}/template/${templateId}`,
    payload,
    apiServicesEnum.CAMPAIGN_SERVICE
  );
};

// Contact Tag Services
export const getContactCampaigns = async () => {
  const url = `${BACKEND_URL}/contact-tag`;
  return await commonrequest(
    "GET",
    url,
    null,
    apiServicesEnum.CAMPAIGN_SERVICE
  );
};

export const postContactCampaigns = async (data) => {
  const payload = preparePayload(data);
  return await commonrequest(
    "POST",
    `${BACKEND_URL}/contact-tag`,
    payload,
    apiServicesEnum.CAMPAIGN_SERVICE
  );
};

export const getContactCampaignsById = async (contactTagId) => {
  return await commonrequest(
    "GET",
    `${BACKEND_URL}/contact-tag/${contactTagId}`,
    null,
    apiServicesEnum.CAMPAIGN_SERVICE
  );
};

export const updateContactCampaignsById = async (contactTagId, data) => {
  const payload = preparePayload(data);
  return await commonrequest(
    "PATCH",
    `${BACKEND_URL}/contact-tag/${contactTagId}`,
    payload,
    apiServicesEnum.CAMPAIGN_SERVICE
  );
};

// Campaigns Services
export const getCampaigns = async (data) => {
  const payload = preparePayload(data);
  return await commonrequest(
    "POST",
    `${BACKEND_URL}/campaign/search`,
    payload,
    apiServicesEnum.CAMPAIGN_SERVICE
  );
};

export const postCampaigns = async (data) => {
  const payload = preparePayload(data);
  return await commonrequest(
    "POST",
    `${BACKEND_URL}/campaign`,
    payload,
    apiServicesEnum.CAMPAIGN_SERVICE
  );
};

export const getCampaignsById = async (searviceId, campaignId) => {
  return await commonrequest(
    "GET",
    `${BACKEND_URL}/campaign/${searviceId}/${campaignId}`,
    null,
    apiServicesEnum.CAMPAIGN_SERVICE
  );
};

export const updateCampaignsById = async (contactTagId, data) => {
  const payload = preparePayload(data);
  return await commonrequest(
    "PATCH",
    `${BACKEND_URL}/campaign/${contactTagId}`,
    payload,
    apiServicesEnum.CAMPAIGN_SERVICE
  );
};

//Campaign Scheduling Services
export const getCampScheduling = async (campaignId) => {
  const url = `${BACKEND_URL}/scheduling/list/${campaignId}`;
  return await commonrequest(
    "GET",
    url,
    null,
    apiServicesEnum.CAMPAIGN_SERVICE
  );
};

export const postCampScheduling = async (data) => {
  const payload = preparePayload(data);
  return await commonrequest(
    "POST",
    `${BACKEND_URL}/scheduling`,
    payload,
    apiServicesEnum.CAMPAIGN_SERVICE
  );
};

export const getCampSchedulingById = async (campaignId, campSchedulingId) => {
  return await commonrequest(
    "GET",
    `${BACKEND_URL}/scheduling/${campaignId}/${campSchedulingId}`,
    null,
    apiServicesEnum.CAMPAIGN_SERVICE
  );
};

export const updateCampSchedulingById = async (campSchedulingId, data) => {
  const payload = preparePayload(data);
  return await commonrequest(
    "PATCH",
    `${BACKEND_URL}/scheduling/${campSchedulingId}`,
    payload,
    apiServicesEnum.CAMPAIGN_SERVICE
  );
};
