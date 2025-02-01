import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig, AxiosResponse } from "axios";
import { logout as managerLogout } from "../redux/slices/managerSlice";
import { store } from "../redux/store/store";
import toast from "react-hot-toast";

interface RefreshTokenResponse {
  accessToken: string;
  message: string;
}

interface LogoutResponse {
  message: string;
}

type RefreshSubscriber = (token: string) => void;

let isRefreshing = false;
let refreshSubscribers: RefreshSubscriber[] = [];

const notifySubscribers = (newAccessToken: string): void => {
  refreshSubscribers.forEach((callback) => callback(newAccessToken));
  refreshSubscribers = [];
};

const handleTokenRefresh = async (
  originalRequest: InternalAxiosRequestConfig
): Promise<AxiosResponse> => {
  if (isRefreshing) {
    return new Promise((resolve) => {
      refreshSubscribers.push((newAccessToken: string) => {
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        resolve(managerInstance(originalRequest));
      });
    });
  }

  isRefreshing = true;

  try {
    console.log("Attempting token refresh...");
    const { data } = await managerInstance.post<RefreshTokenResponse>(
      "/manager-service/api/manager/refresh-token"
    );
    console.log("Token refresh successful:", data);

    notifySubscribers(data.accessToken);
    originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
    window.location.reload();

    return managerInstance(originalRequest);
  } catch (error) {
    console.log("Token refresh failed.");
    await handleTokenError(error);
    throw error;
  } finally {
    isRefreshing = false;
  }
};

const handleTokenError = async (error: unknown): Promise<void> => {
  console.log("Handling token error...", error);
  store.dispatch(managerLogout());
  
  try {
    const result = await axios.post<LogoutResponse>(
      "http://backend.aadil.online/manager-service/api/manager/logout"
    );
    toast.success(result.data.message);
    console.log("Logged out successfully.");
  } catch (logoutError) {
    console.error("Logout failed:", logoutError);
  }
};

export const managerInstance: AxiosInstance = axios.create({
  baseURL: "http://backend.aadil.online",
  withCredentials: true,
});

managerInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    console.log("Error received:", error);
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

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