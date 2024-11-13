import axios from "axios";
import { logout as superAdminLogout } from "../features/superAdminSlice";
import { logout as businessOwnerLogout } from "../features/businessOwnerSlice";
import { store } from "../store/store";
import { log } from "console";

// Create a reusable function to handle the refresh token logic
const handleTokenRefresh = async (originalRequest: any) => {
    console.log("Attempting refresh token -------------------------------222");
  try {
    const refreshResponse = await businessOwnerInstance.post('/businessOwner/api/business-owner/refresh-token');
    
    if (refreshResponse.status === 200) {
      const newAccessToken = refreshResponse.data.accessToken;
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      return businessOwnerInstance(originalRequest); 
    }
  } catch (refreshError: any) {
    handleTokenError(refreshError);
  }
};

const handleTokenError = (refreshError: any) => {
  try {
    store.dispatch(businessOwnerLogout());
    businessOwnerInstance.post('/businessOwner/api/business-owner/logout');
    console.log('Business owner logged out successfully');
  } catch (error) {
    console.error('Logout failed:', error);
  }

  console.error('Refresh token failed:', refreshError);
};

// Axios instance for business owner API
export const businessOwnerInstance = axios.create({
  baseURL: 'http://localhost:3000',
  withCredentials: true, 
});

businessOwnerInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      return handleTokenRefresh(originalRequest);  // Handle the token refresh
    }

    return Promise.reject(error);  // Reject if token refresh fails or it's not a 401
  }
);
