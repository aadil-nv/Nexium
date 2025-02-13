import { businessOwnerInstance } from "../services/businessOwnerInstance";
import { message } from "antd";
import toast from "react-hot-toast";


interface CommonInfo {
  email: string;
  phone: string;
  profilePicture?: string;
  personalWebsite?: string;
}

interface AddressData {
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}

export const fetchManagers = async () => {
  try {
    const response = await businessOwnerInstance.get("/businessOwner-service/api/manager/get-managers");
    return response.data;
  } catch (error) {
    console.error("Error fetching managers:", error);
    throw error;
  }
};

export const fetchBusinessOwnerPersonalInfo = async () => {
  try {
    const response = await businessOwnerInstance.get("/businessOwner-service/api/business-owner/get-personaldetailes",
      {headers: { "Content-Type": "application/json",},});

    return response.data.data;
  } catch (error) {
    console.error("Error fetching business owner personal details:", error);
  }
};

export const fetchCompanyDetails = async (isBusinessOwner: boolean) => {
  if (isBusinessOwner) {
    try {
      const response = await businessOwnerInstance.get(
        "/businessOwner-service/api/business-owner/get-companydetailes"
      );
      const data = response.data.data;
      return {
        companyName: data.companyName,
        companyLogo: data.companyLogo,
        companyRegistrationNumber: data.companyRegistrationNumber || "",
        companyEmail: data.companyEmail || "",
        companyWebsite: data.companyWebsite || "",
      };
    } catch (error) {
      console.error("Error fetching company details:", error);
      throw error; // Optionally throw error to handle it in the calling component
    }
  } else {
    return null; // Return null if not a business owner
  }
};

export const fetchBusinessOwnerAddress = async () => {
  try {
    const response = await businessOwnerInstance.get(
      "/businessOwner-service/api/business-owner/get-address"
    );
    console.log("address is from API ==", response);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching business owner address:", error);
    throw error;
  }
};

import axios from "axios";

export const updateBusinessOwnerAddress = async (values: AddressData) => {
  try {
    const response = await businessOwnerInstance.post(
      "/businessOwner-service/api/business-owner/update-address",
      values
    );
    console.log("Address updated successfully:", response.data);
    return response.data;
  } catch (error) {
    const message =
      axios.isAxiosError(error) && error.response?.data?.message
        ? error.response.data.message
        : "Failed to update address";
    console.error("Error:", message);
    throw new Error(message);
  }
};


export const uploadBusinessOwnerProfileImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);
  try {
    const { data } = await businessOwnerInstance.post(
      "/businessOwner-service/api/business-owner/upload-images",
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    message.success("Image uploaded successfully!");
    return data.data.data.imageUrl;
  } catch (error) {
    message.error("Failed to upload image.");
    throw error;
  }
};

export const updateBusinessOwnerPersonalInfo = async (details : CommonInfo): Promise<void> => {
  try {
    await businessOwnerInstance.patch(
      "/businessOwner-service/api/business-owner/update-personaldetailes",
      details
    );
    message.success("Details updated successfully!");
  } catch (error) {
    message.error("Failed to update details.");
    throw error;
  }
};

export const fetchBusinessOwnerDocument = async () => {
  try {
    const response = await businessOwnerInstance.get(
      "/businessOwner-service/api/business-owner/get-documents"
    );
    return response.data.result;
  } catch (error) {
    console.error("Error fetching document:", error);
    throw new Error("Failed to fetch document.");
  }
};

export const uploadBuisnessOwnerDocument = async (file: File) => {
  try {
    if (!file) {
      toast.error("No file selected.");
      return;
    }
    const formData = new FormData();
    formData.append("file", file);
    const response = await businessOwnerInstance.post(
      "/businessOwner-service/api/business-owner/upload-documents",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    toast.success("Document uploaded successfully!");
    return response.data.result;
  } catch (error) {
    console.error("Error uploading document:", error);
    toast.error("Failed to upload document.");
  }
};

export const fetchDashboardData = async () => {
  try {
    const response = await businessOwnerInstance.get('/businessOwner-service/api/dashboard/dashboard-data');
    return response.data;
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    throw error;
  }
};

export const fetchInvoices = async () => {
  try {
    const response = await businessOwnerInstance.get('/businessOwner-service/api/subscription/invoices');
    return response.data;
  } catch (error) {
    console.error('Error fetching invoices:', error);
    throw error;
  }
}

