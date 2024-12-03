import { superAdminInstance } from '../services/superAdminInstance';
import { IBusinessOwner } from "../interface/superAdminInterface";
import axios from "axios";


export const loginSuperAdmin = async (data) => {
    try {
      const response = await axios.post(
        "http://localhost:7000/api/super-admin/superadmin-login",
        data,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      return response.data;
    } catch (err) {
      throw err.response?.data?.message || "Login failed";
    }
  };
  
export const fetchAllPlans = async () => {
  try {
    const response = await superAdminInstance.get(`/superAdmin/api/subscription/fetch-all-subscriptions`);
    return response.data.success ? response.data.subscriptions : [];
  } catch (error) {
    console.error('Error fetching plans data:', error);
    return [];
  }
};

export const updatePlanStatus = async (planId: string, newStatus: boolean) => {
  try {
    await superAdminInstance.patch(`/superAdmin/api/subscription/update-status/${planId}`, { isActive: newStatus });
  } catch (error) {
    console.error('Error updating plan status:', error);
  }
};

export const fetchBusinessOwners = async (): Promise<IBusinessOwner[]> => {
  try {
    const { data: responseData } = await superAdminInstance.get("/superAdmin/api/businessowner/find-all-companies");
    console.log("responce data is =========>",responseData.businessOwners);
    return responseData.businessOwners.map((owner: any) => ({
      id: owner._id,
      name: owner.companyDetails.companyName,
      email: owner.personalDetails.email,
      phone: owner.personalDetails.phone,
   
      subscriptionStatus: owner.subscription?.status || "N/A",
      isBlocked: owner.isBlocked,
    }));
  } catch (err) {
    throw new Error("Error fetching business owners");
  }
};


export const updateBlockStatus = async (id: string, isBlocked: boolean): Promise<void> => {
  try {
    await superAdminInstance.patch(`/superAdmin/api/businessowner/update-isblocked/${id}`, { isBlocked });
  } catch (err) {
    throw new Error("Failed to update block status.");
  }
};





