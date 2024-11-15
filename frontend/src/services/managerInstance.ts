import axios from "axios";

import { logout as managerLogout } from "../features/managerSlice";
import { store } from "../store/store";

let isRefreshing = false;
let refreshSubscribers: any[] = [];

const notifySubscribers = (newAccessToken: string) => {
  refreshSubscribers.forEach((callback) => callback(newAccessToken));
  refreshSubscribers = [];
};

const handleTokenRefresh = async (originalRequest: any) => {
  if (isRefreshing) {
    return new Promise((resolve) => {
      refreshSubscribers.push((newAccessToken: string) => {
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        resolve(managerInstance(originalRequest));
      });
    });
  }

  isRefreshing = true;

  try {
    console.log("Attempting token refresh...");
    const { data } = await managerInstance.post("/manager/api/manager/refresh-token");

    notifySubscribers(data.accessToken);
    originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
    return managerInstance(originalRequest);
  } catch (error) {
    console.log("Token refresh failed.");
    await handleTokenError(error);
    throw error;
  } finally {
    isRefreshing = false;
  }
};

const handleTokenError = async (error: any) => {
  console.log("Handling token error...");
  store.dispatch(managerLogout());
  try {
    await axios.post("http://localhost:3000/manger/api/manager/logout");
    console.log("Logged out successfully.");
  } catch (logoutError) {
    console.error("Logout failed:", logoutError);
  }
};

export const managerInstance = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,
});

managerInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      return handleTokenRefresh(originalRequest);
    }
    return Promise.reject(error);
  }
);
