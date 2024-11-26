import axios from 'axios';
import { useState, useEffect } from 'react';
import { businessOwnerInstance } from '../services/businessOwnerInstance';
import { message } from 'antd';

export const fetchManagers = async () => {
  try {
    const response = await businessOwnerInstance.get('/businessOwner/api/manager/get-managers');
    console.log("manger is from API ==",response)
    return response.data;
  } catch (error) {
    console.error('Error fetching managers:', error);
    await axios.post('http://localhost:3000/businessOwner/api/business-owner/logout');
    throw error;
  }
};

export const usePersonalDetails = (isAuthenticated: boolean) => {
  const [loading, setLoading] = useState(true);
  const [personalDetails, setPersonalDetails] = useState<any>(null);

  useEffect(() => {
    if (isAuthenticated) {
      const fetchPersonalDetails = async () => {
        try {
          const response = await businessOwnerInstance.get(
            '/businessOwner/api/business-owner/get-personaldetailes'
          );
          setPersonalDetails(response.data.data);
        } catch (error) {
          console.error('Error fetching business owner personal details:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchPersonalDetails();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  return { loading, personalDetails };
};
export const fetchCompanyDetails = async (isBusinessOwner) => {
  if (isBusinessOwner) {
    try {
      const response = await businessOwnerInstance.get('/businessOwner/api/business-owner/get-companydetailes');
      const data = response.data.data;
      return {
        companyName: data.companyName || '',
        companyLogo: data.companyLogo || 'https://example.com/default-logo.png',
        companyRegistrationNumber: data.companyRegistrationNumber || '',
        companyEmail: data.companyEmail || '',
        companyWebsite: data.companyWebsite || '',
        companyLogoUrl: data.companyLogo || 'https://example.com/default-logo.png',
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
    return response.data.data;
  } catch (error) {
    console.error('Error fetching business owner address:', error);
    throw error;
  }
};

export const uploadProfileImage = async (file: File): Promise<string> => {
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