import axios from "axios";
import { logout as superAdminLogout } from "../redux/slices/superAdminSlice";
import { logout as businessOwnerLogout } from "../redux/slices/businessOwnerSlice";
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
        resolve(businessOwnerInstance(originalRequest));
      });
    });
  }

  isRefreshing = true;

  try {
    console.log("Attempting token refresh...");
    const { data } = await businessOwnerInstance.post("/businessOwner/api/business-owner/refresh-token");

    notifySubscribers(data.accessToken);
    originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
    return businessOwnerInstance(originalRequest);
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
  store.dispatch(businessOwnerLogout());
  try {
    const result = await axios.post("http://localhost:3000/businessOwner/api/business-owner/logout");
    toast.success(result.data.message);
    console.log("Logged out successfully.");
  } catch (logoutError) {
    console.error("Logout failed:", logoutError);
  }
};

export const businessOwnerInstance = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,
});

businessOwnerInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      return handleTokenRefresh(originalRequest);
    }
    if (error.response?.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;
      return handleTokenError(error);
    }
    return Promise.reject(error);
  }
);
