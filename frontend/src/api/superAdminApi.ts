import { superAdminInstance } from '../services/superAdminInstance';
import { IBusinessOwner } from "../interface/superAdminInterface";
import axios from "axios";

interface IBusinessOwnerResponse {
  _id: string;
  companyDetails: {
    companyName: string;
  };
  personalDetails: {
    email: string;
    phone: string;
  };
  subscription?: {
    status?: string;
  };
  isBlocked: boolean;
}
const API_URL = import.meta.env.VITE_API_KEY as string

export const loginSuperAdmin = async (data: { email: string; password: string }) => {
  try {
    const response = await axios.post(
      `${API_URL}/api/super-admin/superadmin-login`,
      data,
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Login failed");
    } else {
      throw new Error("An unexpected error occurred during login");
    }
  }
};

  
export const fetchAllPlans = async () => {
  try {
    const response = await superAdminInstance.get(`/superAdmin-service/api/subscription/fetch-all-subscriptions`);
    return response.data.success ? response.data.subscriptions : [];
  } catch (error) {
    console.error('Error fetching plans data:', error);
    return [];
  }
};

export const updatePlanStatus = async (planId: string, newStatus: boolean) => {
  try {
    await superAdminInstance.patch(`/superAdmin-service/api/subscription/update-status/${planId}`, { isActive: newStatus });
  } catch (error) {
    console.error('Error updating plan status:', error);
  }
};



export const fetchBusinessOwners = async (): Promise<IBusinessOwner[]> => {
  try {
    const { data: responseData } = await superAdminInstance.get("/superAdmin-service/api/businessowner/find-all-companies");

    return responseData.businessOwners.map((owner: IBusinessOwnerResponse) => ({
      id: owner._id,
      name: owner.companyDetails.companyName,
      email: owner.personalDetails.email,
      phone: owner.personalDetails.phone,
      subscriptionStatus: owner.subscription?.status || "N/A",
      isBlocked: owner.isBlocked,
    }));
  } catch (error) {
    if (error instanceof Error) {
      const axiosError = error as { response?: { data?: { message?: string } } };
      throw new Error(axiosError.response?.data?.message || "Error fetching business owners");
    } else {
      throw new Error("An unexpected error occurred while fetching business owners.");
    }
  }
};


export const updateBlockStatus = async (id: string, isBlocked: boolean): Promise<void> => {
  try {
    await superAdminInstance.patch(`/superAdmin-service/api/businessowner/update-isblocked/${id}`, { isBlocked });
  } catch (error:unknown) {
    if (error instanceof Error) {
      const axiosError = error as { response?: { data?: { message?: string } } };
      throw new Error(axiosError.response?.data?.message || "Failed to update block status.");
    } else {
      throw new Error("An unexpected error occurred.");
    }
  }
};





