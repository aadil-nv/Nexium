import axios, { 
  AxiosInstance, 
  AxiosError, 
  InternalAxiosRequestConfig, 
  AxiosResponse 
} from "axios";
import { logout as businessOwnerLogout } from "../redux/slices/businessOwnerSlice";
import { store } from "../redux/store/store";
import toast from "react-hot-toast";

// Extend the AxiosRequestConfig with our custom _retry property
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
        resolve(businessOwnerInstance(originalRequest));
      });
    });
  }

  isRefreshing = true;

  try {
    const { data } = await businessOwnerInstance.post("/businessOwner-service/api/business-owner/refresh-token");
    notifySubscribers(data.accessToken);
    
    if (originalRequest.headers) {
      originalRequest.headers['Authorization'] = `Bearer ${data.accessToken}`;
    }
    return businessOwnerInstance(originalRequest);
  } catch (error) {
    await handleTokenError(error as AxiosError);
    throw error;
  } finally {
    isRefreshing = false;
  }
};

const handleTokenError = async (error: AxiosError) => {
  console.log("Handling token error...",error);
  store.dispatch(businessOwnerLogout());
  try {
    const result = await axios.post("http://localhost:3000/businessOwner-service/api/business-owner/logout");
    toast.success(result.data.message);
  } catch (logoutError) {
    console.error("Logout failed:", logoutError);
  }
};

export const businessOwnerInstance: AxiosInstance = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,
});

businessOwnerInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig;
    
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