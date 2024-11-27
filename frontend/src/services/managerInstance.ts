import axios from "axios";

import { logout as managerLogout } from "../redux/slices/managerSlice";
import { store } from "../redux/store/store";
import toast from "react-hot-toast";

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
    const { data } = await managerInstance.post("/manager/api/manager/refresh-token")
    console.log("data  --->", data);

    // notifySubscribers(data.accessToken);
    // originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
    // return managerInstance(originalRequest);
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
    const result =await axios.post("http://localhost:3000/manager/api/manager/logout");
    toast.success(result.data.message);
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
    console.log("error ================================>", error);
    const originalRequest = error.config;
    console.log("originalRequest--->", originalRequest);
    if (error.response?.status == 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      return handleTokenRefresh(originalRequest);
    }
    return Promise.reject(error);
  }
);
