import axios from 'axios';
import { businessOwnerInstance } from '../services/businessOwnerInstance';

export const fetchManagers = async () => {
  try {
    const response = await businessOwnerInstance.get('/businessOwner/api/manager/get-managers');
    return response.data;
  } catch (error) {
    console.error('Error fetching managers:', error);
    await axios.post('http://localhost:3000/businessOwner/api/business-owner/logout');
    throw error;
  }
};
