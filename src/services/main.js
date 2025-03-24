//API CALL
import axios from "axios";
// import { refreshToken } from "./Api";
import { refreshToken } from "./userService";
import { apiServicesEnum } from "../utils/apiServiceEnum";
import store from "../store/store";
import { setSessionExpired } from "../store/slices/loaderSlice";
let requestedRefreshToken = false;
let errorRequest = [];
const refreshAccessToken = async () => {
  const refresh = localStorage.getItem("refresh");
  const token = localStorage.getItem("token");
  localStorage.removeItem("token", token);
  try {
    const response =
      refresh &&
      (await refreshToken(
        {
          data: {
            refreshToken: refresh,
          },
        },
        {
          "x-api-key": import.meta.env.VITE_APP_API_KEY,
        }
      ));
    if (response && response.data) {
      localStorage.removeItem("refresh", refresh);
      const newAccessToken = response.data.data.tokens.accessToken;
      const newRefreshToken = response.data.data.tokens.refreshToken;
      localStorage.setItem("token", newAccessToken);
      localStorage.setItem("refresh", newRefreshToken);
      requestedRefreshToken = false;
      return newAccessToken;
    } else {
      // return Promise.reject('Unauthorized');
      // throw new Error('Parameter is not a number!');
      // console.log("eorororororororo")
      localStorage.removeItem("refresh", refresh);
    }
  } catch (error) {
    // console.log('errorrrr', error)
    // if (error?.response?.status === 401) {
    localStorage.removeItem("refresh", refresh);
    // }
  }
};
export const commonrequest = async (
  method,
  url,
  body,
  serviceName,
  header = {}
) => {
  let api_key = "";
  switch (serviceName) {
    case apiServicesEnum.USER_SERVICE: {
      api_key = import.meta.env.VITE_APP_API_KEY;
      break;
    }
    case apiServicesEnum.MSTER_SERVICE: {
      api_key = import.meta.env.VITE_APP_API_KEY_MSTER;
      break;
    }
    case apiServicesEnum.LEAD_SERVICE: {
      api_key = import.meta.env.VITE_APP_API_KEY_LEAD;
      break;
    }
    case apiServicesEnum.CAMPAIGN_SERVICE: {
      api_key = import.meta.env.VITE_APP_API_KEY_CAMPAIGN;
      break;
    }
    default: {
      api_key = import.meta.env.VITE_APP_API_KEY;
      break;
    }
  }
  // console.log(serviceName, api_key)
  //to check if access token is available in localStorage
  const accessToken = localStorage.getItem("token");
  const groupId = localStorage.getItem("groupId");
  let config = {
    method: method,
    url: url,
    headers: {
      "x-api-key": api_key,
      "x-app-key": import.meta.env.VITE__APP_APP_KEY,
      "x-access-token": accessToken,
      "x-group-id": groupId,
      ...header,
    },
    data: body,
    params: { requestId: `WEB_${new Date().getTime()}` },
  };
  //interceptor
  axios.interceptors.response.use(
    function (response) {
      return response;
    },
    async function (error) {
      // console.log('error', error)
      if (error?.response?.status === 401) {
        if (!requestedRefreshToken) {
          errorRequest = [];
          requestedRefreshToken = true;
          try {
            const newAccessToken = await refreshAccessToken();
            if (newAccessToken) {
              error.config.headers["x-access-token"] = newAccessToken;
              errorRequest.forEach((req) => {
                req.headers["x-access-token"] = newAccessToken;
                axios.request(req);
              });
              return axios.request(error.config);
            } else {
              store.dispatch(
                setSessionExpired({
                  condtion: true,
                  msg: "Session has been Expired!",
                })
              );
              localStorage.clear();
              window.location.href = "/login";
            }
          } catch (refreshError) {
            // localStorage.clear()
            // window.location.href = "/login"
            store.dispatch(
              setSessionExpired({
                condtion: true,
                msg: "Session has been Expired!",
              })
            );
            localStorage.clear();
            window.location.href = "/login";
          }
        } else {
          if (error.config.url.includes("/refresh-token")) {
            store.dispatch(
              setSessionExpired({
                condtion: true,
                msg: "Session has been Expired!",
              })
            );
          } else {
            if (
              !errorRequest.find(
                (req) =>
                  req.url == error.config.url &&
                  req.method == error.config.method
              )
            ) {
              errorRequest.push(error.config);
            }
          }
          // window.location.href = "/login"
          // localStorage.clear()
        }
      }
      return Promise.reject(error);
    }
  );
  //axios instance
  return axios(config)
    .then((data) => {
      return data;
    })
    .catch((err) => {
      return err;
    });
};
