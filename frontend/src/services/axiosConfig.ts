import axios from "axios";
import { logout as superAdminLogout } from "../features/superAdminSlice";
import { logout as businessOwnerLogout } from "../features/businessOwnerSlice";
import { store } from "../store/store";

// Axios instance with base URL and credentials
export const privateApi = axios.create({
  baseURL: 'http://localhost:7002/api',
  withCredentials: true,  // Ensure cookies are included in requests
});

privateApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    console.log("Checking refresh token -------------------------------111", error.response?.status);

    // Check for 401 and ensure we haven't already retried the request
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      console.log("Attempting refresh token -------------------------------222");

      try {
        // Request new access token
        const refreshResponse = await axios.post('http://localhost:7002/api/businessowner/refresh-token');
        console.log(refreshResponse.status, '   xxxxxxxxxxxxxxxxxxxxx Response in axios interceptor');

        if (refreshResponse.status === 200) {
          const newAccessToken = refreshResponse.data.accessToken;

          // Update the authorization header with the new token
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

          // Retry the original request with the new token
          return privateApi(originalRequest);
        }
      } catch (refreshError: any) {
        if (refreshError.response?.status === 403) {
          console.log("Refreshing token failed -------------------------------555");

          // Logout the user based on their role
          const state = store.getState();
          const userRole = state.superAdmin.role || state.businessOwner.role;

          if (userRole === 'superAdmin') {
            store.dispatch(superAdminLogout());
          } else if (userRole === 'businessOwner') {
            store.dispatch(businessOwnerLogout());
          }
        }
        console.error('Refresh token failed:', refreshError);
      }
    }

    // Reject the promise with the error if we can't handle it
    return Promise.reject(error);
  }
);