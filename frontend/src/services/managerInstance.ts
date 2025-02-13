import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig, AxiosResponse } from "axios";
import { logout as managerLogout } from "../redux/slices/managerSlice";
import { store } from "../redux/store/store";
import toast from "react-hot-toast";
import {HttpStatusCode} from "../utils/enum"


const apiUrl = import.meta.env.VITE_API_KEY as string


export const managerInstance: AxiosInstance = axios.create({baseURL: apiUrl,withCredentials: true});

const handleTokenRefresh = async (originalRequest: InternalAxiosRequestConfig): Promise<AxiosResponse> => {
  try {
    console.log("Attempting token refresh...");
     await managerInstance.post("/manager-service/api/manager/refresh-token");
     return managerInstance(originalRequest);
  } catch (error) {
    await handleTokenError(error);
    throw error;
  }
};

const handleTokenError = async (error: unknown): Promise<void> => {
  console.log("Token error trying to logout...",error);
  store.dispatch(managerLogout());
  try {
    const result = await managerInstance.post("/manager-service/api/manager/logout");
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

managerInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
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