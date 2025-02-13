import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig, AxiosResponse } from "axios";
import { logout as managerLogout } from "../redux/slices/managerSlice";
import { store } from "../redux/store/store";
import toast from "react-hot-toast";
import {HttpStatusCode} from "../utils/enum"


declare module 'axios' {
  interface InternalAxiosRequestConfig {
    _retry?: boolean;
  }
}
const apiUrl = import.meta.env.VITE_API_KEY as string

export const communicationInstance: AxiosInstance = axios.create({baseURL:apiUrl,withCredentials: true});


const handleTokenRefresh = async (originalRequest: InternalAxiosRequestConfig) => {
  try {
    console.log("Attempting token refresh...");
     await communicationInstance.post("/communication-service/api/chat/refresh-token");
     return communicationInstance(originalRequest);
  } catch (error) {
    console.log("Token refresh failed.");
    await handleTokenError(error as AxiosError);
    throw error;
  }
};

const handleTokenError = async (error: AxiosError) => {
  console.log("Token error trying to logout...",error);
  store.dispatch(managerLogout());
  try {
    const result = await axios.post(`${apiUrl}/communication-service/api/chat/logout`);
    toast.success(result.data.message);
  } catch (logoutError) {
    console.error("Logout failed:", logoutError);
  }
};


communicationInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    console.log("Error received:", error);
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