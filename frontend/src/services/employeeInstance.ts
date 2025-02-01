import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig, AxiosResponse } from "axios";
import { logout as employeeLogout } from "../redux/slices/employeeSlice";
import { store } from "../redux/store/store";
import toast from "react-hot-toast";


declare module 'axios' {
  interface InternalAxiosRequestConfig {
    _retry?: boolean;
  }
}

type RefreshCallback = (token: string) => void;

let isRefreshing = false;
let refreshSubscribers: RefreshCallback[] = [];

const notifySubscribers = (newAccessToken: string) => {
  refreshSubscribers.forEach((callback) => callback(newAccessToken));
  refreshSubscribers = [];
};

const handleTokenRefresh = async (originalRequest: InternalAxiosRequestConfig) => {
  if (isRefreshing) {
    return new Promise((resolve) => {
      refreshSubscribers.push((newAccessToken: string) => {
        if (originalRequest.headers) {
          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        }
        resolve(employeeInstance(originalRequest));
      });
    });
  }

  isRefreshing = true;

  try {
    console.log("Attempting token refresh...");
    const {data}=await employeeInstance.post("/employee-service/api/employee/refresh-token");
    notifySubscribers(data.accessToken);

  } catch (error) {
    console.log("Token refresh failed.");
    await handleTokenError(error as AxiosError);
    throw error;
  } finally {
    isRefreshing = false;
  }
};

const handleTokenError = async (error: AxiosError) => {
  console.log("Handling token error...", error);
  store.dispatch(employeeLogout());
  try {
    const result = await axios.post("https://backend.aadil.online/employee-service/api/employee/logout");
    toast.success(result.data.message);
    console.log("Logged out successfully.");
  } catch (logoutError) {
    console.error("Logout failed:", logoutError);
  }
};

export const employeeInstance: AxiosInstance = axios.create({
  baseURL: "https://backend.aadil.online",
  withCredentials: true,
});

employeeInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      return handleTokenRefresh(originalRequest);
    }
    
    return Promise.reject(error);
  }
);