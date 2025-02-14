import axios from 'axios';
import { TokenResponse } from '@react-oauth/google';


interface GoogleUserData {
  id: string;
  email: string;
  name: string;
  givenName: string;
  familyName: string;
  picture: string;
  sub: string
}

interface LoginResponse {
  success: boolean;
  isVerified?: boolean;
  companyName?: string;
  profilePicture?: string;
  companyLogo?: string;
  email?: string;
  
}

const API_URL = import.meta.env.VITE_API_KEY


type Plan = {
  _id: string;
  planName: string;
  price: number;
  features: string[];
  isActive: boolean;
};

export const resendOtp = async (email: string) => {
  try {
    const response = await axios.post(`${API_URL}/authentication-service/api/business-owner/resend-otp`, { email });
    return response.data;
  } catch (error) {
    console.log("Error resending OTP:", error);
    throw new Error('Error resending OTP. Please try again.');
  }
};

export const validateOtp = async (email: string, otp: string) => {
  try {
    const response = await axios.post(`${API_URL}/authentication-service/api/business-owner/otp-validation`, { email, otp });
    return response.data;
  } catch (error) {
    console.log("Error verifying OTP:", error);
    
    throw new Error('Error verifying OTP. Please try again.');
  }
};

export const loginBusinessOwnerAPI = async (email:string, password:string) => {
    const { data } = await axios.post(
      `${API_URL}/authentication-service/api/business-owner/login`,
      { email, password },
      { withCredentials: true }
    );
    return data;
 
};

export const changePasswordAPI = async (password: string, email: string) => {
  console.log("email from change password", email);
  
  try {
      const response = await axios.patch(`${API_URL}/authentication-service/api/business-owner/add-newpassword`, {
          password,
          email,
      });

      return response.data;
  } catch (error) {
      console.log("Error changing password:", error);
      throw new Error('An error occurred while changing the password.');
  }
};

export const forgotPassword = async (email: string) => {
  try {
    const response = await axios.post(`${API_URL}/authentication-service/api/business-owner/forgot-password`, { email });
    return response.data; // Return the data
  } catch (error) {
    console.error('Error during forgot password request:', error);
    throw error; // Re-throw the error for the caller to handle
  }
};


export const signUpResendOtp = async (email: string) => {
  try {
    const response = await axios.post(`${API_URL}/authentication-service/api/business-owner/resend-otp`, { email });
    return response.data;
  } catch (error) {
    console.log("Error signup-resending OTP:", error);
    throw new Error('Error resending OTP.');
  }
};

export const SignUpValidateOtp = async (email: string, otp: string) => {
  try {
    const response = await axios.post(
      `${API_URL}/authentication-service/api/business-owner/otp-validation`,
      { email, otp },
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.log("Error signup-verifying OTP:", error);
    throw new Error('Error verifying OTP.');
  }
}


export const signUpBusinessOwner = async (companyName: string, registrationNumber: string, email: string, password: string, phone: string) => {
  try {
    const response = await axios.post(`${API_URL}/authentication-service/api/business-owner/register`, {
      companyName,
      registrationNumber,
      email,
      password,
      phone,
      address: 'local',
      website: '',
      documents: [],
    });

    return response.data;
  } catch (error) {
    console.error("Error during signup:", error);
    throw new Error('An error occurred during signup. Please try again.');
  }
};


export const fetchPlans = async () => {
  try {
    const response = await axios.get(`${API_URL}/superAdmin-service/api/subscription/get-subscription`);
    if (response.data.success) {
      return response.data.subscriptions;
    }
    throw new Error('Failed to fetch plans');
  } catch (error) {
    console.error('Error fetching plans:', error);
    throw error;
  }
};

export const createCheckoutSession = async (email: string, selectedPlan : Plan) => {
  try {
    const { data } = await axios.post(
      `${API_URL}/payment-service/api/businessowner-payment/create-checkout-session`,
      { email, plan: selectedPlan, amount: selectedPlan.price * 100, currency: 'usd' },
      { withCredentials: true }
    );
    return data;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
};

export const getGoogleUserInfo = async (tokenResponse: TokenResponse) => {
  const { data } = await axios.get<GoogleUserData>(
    `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${tokenResponse.access_token}`
  );
  return {
    id: data.sub,
    email: data.email,
    name: data.name,
    givenName: data.givenName,
    familyName: data.familyName,
    picture: data.picture
  };
};

// Handle Google Login API Call
export const googleLoginAPI = async (googleUserData: GoogleUserData) => {
  const { data } = await axios.post<LoginResponse>(
    `${API_URL}/authentication-service/api/business-owner/google-login`,
    { userData: googleUserData },
    { withCredentials: true }
  );
  return data;
};

//! employee==============================================================================================================================

export const employeeResendOtp = async (email: string) => {
  try {
    const response = await axios.post(`${API_URL}/authentication-service/api/employee/resend-otp`, { email });
    return response.data;
  } catch (error) {
    console.error("Error resending OTP:", error);
    throw new Error(
      axios.isAxiosError(error) ? error.response?.data?.message || "Failed to resend OTP." : "An error occurred."
    );
  }
};

export const employeeValidateOtp = async (email: string, otp: string) => {
  try {
    const response = await axios.post(
      `${API_URL}/authentication-service/api/employee/validate-otp`,
      { email, otp },
      { withCredentials: true }
    );
    console.log("response.data11111111111111111", response.data);
    
    return response
  } catch (error) {
    console.error("Error validating OTP:", error);
    throw new Error(
      axios.isAxiosError(error) ? error.response?.data?.message || "Failed to validate OTP." : "An error occurred."
    );
  }
};

export const employeeLogin = async (email: string, password: string) => {
  try {
    const response = await axios.post(
      `${API_URL}/authentication-service/api/employee/employee-login`,
      { email, password },
      { withCredentials: true }
    );

    return response.data;
  } catch (error) {
    console.error("Error during login:", error);
    return { success: false, message: "An error occurred while logging in." };
  }
};
