import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig, AxiosResponse } from "axios";
import { logout as businessOwnerLogout } from "../redux/slices/businessOwnerSlice";
import { store } from "../redux/store/store";
import toast from "react-hot-toast";
import {HttpStatusCode} from "../utils/enum"

declare module 'axios' {interface InternalAxiosRequestConfig {_retry?: boolean;}}
const apiUrl = import.meta.env.VITE_API_KEY as string

export const businessOwnerInstance: AxiosInstance = axios.create({baseURL: apiUrl,withCredentials: true,});

const handleTokenRefresh = async (originalRequest: InternalAxiosRequestConfig) => {
  try {
    console.log("Attempting token refresh...");
    await businessOwnerInstance.post("/businessOwner-service/api/business-owner/refresh-token");
    return businessOwnerInstance(originalRequest);
  } catch (error) {
    await handleTokenError(error as AxiosError);
    throw error;
  }
};

const handleTokenError = async (error: AxiosError) => {
  console.log("Token error trying to logout...",error);
  store.dispatch(businessOwnerLogout());
  try {
    const result = await businessOwnerInstance.post("/businessOwner-service/api/business-owner/logout");
    toast.success(result.data.message);
  } catch (logoutError) {
    console.error("Logout failed:", logoutError);
  }
};
const handleSubscriptionError = async (error: AxiosError) => {
  console.log("Subscription error trying to logout...",error);
  
  const message = (error.response?.data as { message?: string })?.message || "Subscription error occurred!";
  toast.error(message);
};


businessOwnerInstance.interceptors.response.use(
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
    if (error.response?.status === HttpStatusCode.CONFLICT && !originalRequest._retry) {
      originalRequest._retry = true;
      return handleSubscriptionError(error);
    }
    return Promise.reject(error);
  }
);