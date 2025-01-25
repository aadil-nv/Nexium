import axios, { 
  AxiosInstance, 
  AxiosError, 
  InternalAxiosRequestConfig, 
  AxiosResponse 
} from "axios";
import { logout as managerLogout } from "../redux/slices/managerSlice";
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

// Notify all subscribers of the new token
const notifySubscribers = (newAccessToken: string) => {
  refreshSubscribers.forEach((callback) => callback(newAccessToken));
  refreshSubscribers = [];
};

// Handle token refresh
const handleTokenRefresh = async (originalRequest: InternalAxiosRequestConfig) => {
  if (isRefreshing) {
    return new Promise((resolve) => {
      refreshSubscribers.push((newAccessToken: string) => {
        if (originalRequest.headers) {
          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        }
        resolve(communicationInstance(originalRequest));
      });
    });
  }

  isRefreshing = true;

  try {
    console.log("Attempting token refresh...");
    const { data } = await communicationInstance.post("/communication-service/api/chat/refresh-token");
    console.log("Token refresh successful:", data);
    notifySubscribers(data.accessToken);
    
    if (originalRequest.headers) {
      originalRequest.headers['Authorization'] = `Bearer ${data.accessToken}`;
    }
    window.location.reload();

    return communicationInstance(originalRequest);
  } catch (error) {
    console.log("Token refresh failed.");
    await handleTokenError(error as AxiosError);
    throw error;
  } finally {
    isRefreshing = false;
  }
};

// Handle token errors (logout)
const handleTokenError = async (error: AxiosError) => {
  console.log("Handling token error...", error);
  store.dispatch(managerLogout());
  try {
    const result = await axios.post("http://localhost:3000/communication-service/api/chat/logout");
    toast.success(result.data.message);
    console.log("Logged out successfully.");
  } catch (logoutError) {
    console.error("Logout failed:", logoutError);
  }
};

export const communicationInstance: AxiosInstance = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,
});

// Intercept responses to handle token refresh and errors
communicationInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    console.log("Error received:", error);
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