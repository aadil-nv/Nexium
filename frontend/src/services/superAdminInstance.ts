import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig, AxiosResponse } from "axios";
import { logout as superAdminLogout } from "../redux/slices/superAdminSlice";
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
        resolve(superAdminInstance(originalRequest));
      });
    });
  }

  isRefreshing = true;

  try {
    console.log("Attempting token refresh...");
    const { data } = await axios.post<RefreshTokenResponse>(
      "https://backend.aadil.online/superAdmin/api/superadmin/refresh-token"
    );
    console.log("Token refresh successful:", data);

    notifySubscribers(data.accessToken);
    originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
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

const handleTokenError = async (error: unknown): Promise<void> => {
  console.log("Handling token error...", error);
  store.dispatch(superAdminLogout());
  
  try {
    const result = await axios.post<LogoutResponse>(
      "https://backend.aadil.online/superAdmin/api/superadmin/logout"
    );
    toast.success(result.data.message);
    console.log("Logged out successfully.");
  } catch (logoutError) {
    console.error("Logout failed:", logoutError);
  }
};

export const superAdminInstance: AxiosInstance = axios.create({
  baseURL: "https://backend.aadil.online",
  withCredentials: true,
});

superAdminInstance.interceptors.response.use(
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