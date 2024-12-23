import axios from "axios";
import { logout as superAdminLogout } from "../redux/slices/superAdminSlice";
import { store } from "../redux/store/store";
import toast from "react-hot-toast";

let isRefreshing = false;
let refreshSubscribers: any[] = [];

// Notify all subscribers of the new token
const notifySubscribers = (newAccessToken: string) => {
  refreshSubscribers.forEach((callback) => callback(newAccessToken));
  refreshSubscribers = [];
};

// Handle token refresh
const handleTokenRefresh = async (originalRequest: any) => {
  if (isRefreshing) {
    return new Promise((resolve) => {
      refreshSubscribers.push((newAccessToken: string) => {
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        resolve(superAdminInstance(originalRequest));
      });
    });
  }

  isRefreshing = true;

  try {
    console.log("Attempting token refresh...");
    const { data } = await axios.post("http://localhost:3000/superAdmin/api/superadmin/refresh-token");
    console.log("Token refresh successful:", data);

    // Notify subscribers of the new token
    notifySubscribers(data.accessToken);

    // Update original request headers with the new token
    originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;

    // Refresh the page on successful token refresh
    window.location.reload();

    return superAdminInstance(originalRequest);
  } catch (error) {
    console.log("Token refresh failed.");
    await handleTokenError(error);
    throw error;
  } finally {
    isRefreshing = false;
  }
};

// Handle token errors (logout)
const handleTokenError = async (error: any) => {
  console.log("Handling token error...");
  store.dispatch(superAdminLogout());
  try {
    const result = await axios.post("http://localhost:3000/superAdmin/api/superadmin/logout");
    toast.success(result.data.message);
    console.log("Logged out successfully.");
  } catch (logoutError) {
    console.error("Logout failed:", logoutError);
  }
};

// Axios instance for the manager
export const superAdminInstance = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,
});

// Intercept responses to handle token refresh and errors
superAdminInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    console.log("Error received:", error);
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
