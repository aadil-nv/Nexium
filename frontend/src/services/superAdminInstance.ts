import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig, AxiosResponse } from "axios";
import { logout as superAdminLogout } from "../redux/slices/superAdminSlice";
import { store } from "../redux/store/store";
import toast from "react-hot-toast";
import {HttpStatusCode} from "../utils/enum"


const apiUrl = import.meta.env.VITE_API_KEY as string

export const superAdminInstance: AxiosInstance = axios.create({baseURL: apiUrl,withCredentials: true,});


const handleTokenRefresh = async (originalRequest: InternalAxiosRequestConfig): Promise<AxiosResponse> => {
  try {
    console.log("Attempting token refresh...");
    await superAdminInstance.post("/superAdmin-service/api/superadmin/refresh-token");
    return superAdminInstance(originalRequest);
  } catch (error) {
    await handleTokenError(error);
    throw error;
  }
};

const handleTokenError = async (error: unknown): Promise<void> => {
  console.log("Handling token error...", error);
  store.dispatch(superAdminLogout());
  try {
    const result = await superAdminInstance.post("/superAdmin-service/api/superadmin/logout");
    toast.success(result.data.message);
  } catch (logoutError) {
    console.error("Logout failed:", logoutError);
  }
};


superAdminInstance.interceptors.response.use((response: AxiosResponse) => response,async (error: AxiosError) => {
    console.log("Error received:========>", error);
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
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