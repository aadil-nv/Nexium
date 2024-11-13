import axios from "axios";
import { logout as superAdminLogout } from "../features/superAdminSlice";
import { logout as businessOwnerLogout } from "../features/businessOwnerSlice";
import { store } from "../store/store";

// Create a reusable function to handle the refresh token logic
const handleTokenRefresh = async (originalRequest: any) => {
    console.log("Attempting refresh token -------------------------------222");
  try {
    const refreshResponse = await superAdminInstance.post('/superAdmin/api/superadmin/refresh-token');
    
    if (refreshResponse.status === 200) {
      const newAccessToken = refreshResponse.data.accessToken;
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      return superAdminInstance(originalRequest); 
    }
  } catch (refreshError: any) {
    handleTokenError(refreshError);
  }
};

const handleTokenError = (error: any) => {
  if (error.response?.status === 403) {
    const state = store.getState();
    const userRole = state.superAdmin.role || state.businessOwner.role;

    if (userRole === 'superAdmin') {
      store.dispatch(superAdminLogout());
    } else if (userRole === 'businessOwner') {
      store.dispatch(businessOwnerLogout());
    }
  }
  console.error('Refresh token failed:', error);
};

// Axios instance for business owner API
export const superAdminInstance = axios.create({
  baseURL: 'http://localhost:3000',
  withCredentials: true, 
});

superAdminInstance.interceptors.response.use(
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
