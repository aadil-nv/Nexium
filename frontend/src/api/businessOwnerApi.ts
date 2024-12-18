import axios from 'axios';
import { useState, useEffect } from 'react';
import { businessOwnerInstance } from '../services/businessOwnerInstance';
import { message } from 'antd';
import toast from 'react-hot-toast';

export const fetchManagers = async () => {
  try {
    const response = await businessOwnerInstance.get('/businessOwner/api/manager/get-managers');
    console.log("manger is from API ==",response)
    return response.data;
  } catch (error) {
    console.error('Error fetching managers:', error);
    // await axios.post('http://localhost:3000/businessOwner/api/business-owner/logout');
    throw error;
  }
};

export const fetchBusinessOwnerPersonalInfo =async () => {

try {
  const response = await businessOwnerInstance.get('/businessOwner/api/business-owner/get-personaldetailes', {
    headers: {
      "Content-Type": "application/json",
    },
  });

        return response.data.data
      } catch (error) {
        console.error('Error fetching business owner personal details:', error);
      }

    };
     

export const fetchCompanyDetails = async (isBusinessOwner) => {
  if (isBusinessOwner) {
    try {
      const response = await businessOwnerInstance.get('/businessOwner/api/business-owner/get-companydetailes');
      const data = response.data.data;
      return {
        companyName: data.companyName ,
        companyLogo: data.companyLogo ,
        companyRegistrationNumber: data.companyRegistrationNumber || '',
        companyEmail: data.companyEmail || '',
        companyWebsite: data.companyWebsite || '',
     
      };
    } catch (error) {
      console.error('Error fetching company details:', error);
      throw error; // Optionally throw error to handle it in the calling component
    }
  } else {
    return null; // Return null if not a business owner
  }
};

export const fetchBusinessOwnerAddress = async () => {
  try {
    const response = await businessOwnerInstance.get('/businessOwner/api/business-owner/get-address');
     console.log("address is from API ==",response)
    return response.data.data;
  } catch (error) {
    console.error('Error fetching business owner address:', error);
    throw error;
  }
};

export const updateBusinessOwnerAddress = async (values:any) => {
  try {
    const response = await businessOwnerInstance.post("/businessOwner/api/business-owner/update-address",values);
    console.log("Manager address updated successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error('Error updating manager address:', error.response?.data || error.message);
    throw error;
  }
};

export const uploadBusinessOwnerProfileImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
 
  try {
    const { data } = await businessOwnerInstance.post(
      '/businessOwner/api/business-owner/upload-images',
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    message.success('Image uploaded successfully!');
    return data.data.data.imageUrl;
  } catch (error) {
    message.error('Failed to upload image.');
    throw error;
  }
};

export const updateBusinessOwnerPersonalInfo = async (details: any): Promise<void> => {
  try {
    await businessOwnerInstance.patch(
      '/businessOwner/api/business-owner/update-personaldetailes',
      details
    );
    message.success('Details updated successfully!');
  } catch (error) {
    message.error('Failed to update details.');
    throw error;
  }
};


export const fetchBusinessOwnerDocument = async () => {
  try {
    const response = await businessOwnerInstance.get('/businessOwner/api/business-owner/get-documents');
    return response.data.result;
  } catch (error) {
    throw new Error('Failed to fetch document.');
  }
};

// Upload document function
export const uploadBuisnessOwnerDocument   = async (file: File) => {
  
  try {
    if (!file) {toast.error('No file selected.') ;return;}
    const formData = new FormData();
    formData.append('file', file);
    const response = await businessOwnerInstance.post('/businessOwner/api/business-owner/upload-documents', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    toast.success('Document uploaded successfully!');
    return response.data.result;
  } catch (error) {
    toast.error('Failed to upload document.');
  }
};
