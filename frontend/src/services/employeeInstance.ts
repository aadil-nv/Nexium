import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig, AxiosResponse } from "axios";
import { logout as employeeLogout } from "../redux/slices/employeeSlice";
import { store } from "../redux/store/store";
import toast from "react-hot-toast";
import {HttpStatusCode} from "../utils/enum"


declare module 'axios' {
  interface InternalAxiosRequestConfig {
    _retry?: boolean;
  }
}
const apiUrl = import.meta.env.VITE_API_KEY as string

export const employeeInstance: AxiosInstance = axios.create({baseURL: apiUrl,withCredentials: true});

const handleTokenRefresh = async (originalRequest: InternalAxiosRequestConfig) => {
  try {
    console.log("Attempting token refresh...");
    await employeeInstance.post("/employee-service/api/employee/refresh-token");
    return employeeInstance(originalRequest);
  } catch (error) {
    await handleTokenError(error as AxiosError);
    throw error;
  }
};

const handleTokenError = async (error: AxiosError) => {
  console.log("Token error trying to logout...",error);
  store.dispatch(employeeLogout());
  try {
    const result = await employeeInstance.post("/employee-service/api/employee/logout");
    toast.success(result.data.message);
  } catch (logoutError) {
    console.error("Logout failed:", logoutError);
  }
};


employeeInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig;
    if (error.response?.status === HttpStatusCode.UNAUTHORIZED && !originalRequest._retry) {
      originalRequest._retry = true;
      return handleTokenRefresh(originalRequest);
    }
    if (error.response?.status === HttpStatusCode.FORBIDDEN && !originalRequest._retry) {
      originalRequest._retry = true;
      return handleTokenError(error);
    }
    return Promise.reject(error);
  }
);