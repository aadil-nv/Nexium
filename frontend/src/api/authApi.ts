import axios from 'axios';



const apiUrl = import.meta.env.VITE_API_KEY


export const resendOtp = async (email: string) => {
  try {
    const response = await axios.post(`${apiUrl}/authentication/api/business-owner/resend-otp`, { email });
    return response.data;
  } catch (error) {
    throw new Error('Error resending OTP. Please try again.');
  }
};

export const validateOtp = async (email: string, otp: string) => {
  try {
    const response = await axios.post(`${apiUrl}/authentication/api/business-owner/otp-validation`, { email, otp });
    return response.data;
  } catch (error) {
    throw new Error('Error verifying OTP. Please try again.');
  }
};

export const loginBusinessOwnerAPI = async (email:string, password:string) => {
  try {
    const { data } = await axios.post(
      `${apiUrl}/authentication/api/business-owner/login`,
      { email, password },
      { withCredentials: true }
    );
    return data;
  } catch (error) {
    throw error;
  }
};

export const changePasswordAPI = async (password: string, email: string) => {
  try {
      const response = await axios.patch(`${apiUrl}/authentication/api/business-owner/add-newpassword`, {
          password,
          email,
      });

      return response.data;
  } catch (error) {
      throw new Error('An error occurred while changing the password.');
  }
};

export const forgotPassword = async (email: string) => {
  try {
    const response = await axios.post(`${apiUrl}/authentication/api/business-owner/forgot-password`, { email });
    return response.data; // Return the data
  } catch (error) {
    console.error('Error during forgot password request:', error);
    throw error; // Re-throw the error for the caller to handle
  }
};


export const signUpResendOtp = async (email: string) => {
  try {
    const response = await axios.post(`${apiUrl}/authentication/api/business-owner/resend-otp`, { email });
    return response.data;
  } catch (error) {
    throw new Error('Error resending OTP.');
  }
};

export const SignUpValidateOtp = async (email: string, otp: string) => {
  try {
    const response = await axios.post(
      `${apiUrl}/authentication/api/business-owner/otp-validation`,
      { email, otp },
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw new Error('Error verifying OTP.');
  }
}


export const signUpBusinessOwner = async (companyName: string, registrationNumber: string, email: string, password: string, phone: string) => {
  try {
    const response = await axios.post(`${apiUrl}/authentication/api/business-owner/register`, {
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
    const response = await axios.get(`${apiUrl}/superAdmin/api/subscription/get-subscription`);
    if (response.data.success) {
      return response.data.subscriptions;
    }
    throw new Error('Failed to fetch plans');
  } catch (error) {
    console.error('Error fetching plans:', error);
    throw error;
  }
};

export const createCheckoutSession = async (email: string, selectedPlan: any) => {
  try {
    const { data } = await axios.post(
      `${apiUrl}/payment/api/businessowner-payment/create-checkout-session`,
      { email, plan: selectedPlan, amount: selectedPlan.price * 100, currency: 'usd' },
      { withCredentials: true }
    );

    console.log('Checkout session created:9999999999999999999999999', data);
    return data;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
};
