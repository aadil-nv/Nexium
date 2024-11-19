import axios from "axios"
import { LoginFormData } from "../utils/interfaces"
import { managerInstance } from "../services/managerInstance";


export const managerLogin = async (formData: LoginFormData) => {
    try {
        const response = await axios.post('http://localhost:3000/authentication/api/manager/manager-login', formData, {
            withCredentials: true, // Ensure cookies are sent with the request and response
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getAllManagers = async () => {
    try {
        const response = await managerInstance.get('/manager/api/manager/get-managers', {
            withCredentials: true, // Ensure cookies are sent with the request and response
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};


export const validateOtp = async (otp: string ,email: string) => {
    try {
        const response = await axios.post('http://localhost:3000/authentication/api/manager/validate-otp', { otp, email }, {
            withCredentials: true, // Ensure cookies are sent with the request and response
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};