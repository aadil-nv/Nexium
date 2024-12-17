import { toast } from "react-toastify";
import { employeeInstance } from "../services/employeeInstance";


export const fetchAttendanceData = async () => {
  try {
    const response = await employeeInstance.get("/employee/api/attendance/get-attendances");
    return response.data;
  } catch (error) {
    console.error("Error fetching attendance data:", error);
    throw error; // or return a default value
  }
};

export const markCheckIn = async (checkInData) => {
  try {
    const response = await employeeInstance.post("/employee/api/attendance/mark-checkin/", checkInData);
    return response.data;
  } catch (error) {
    console.error("Error marking check-in:", error);
    throw error;
  }
};

export const markCheckOut = async (checkOutData) => {
  try {
    const response = await employeeInstance.post("/employee/api/attendance/mark-checkout", checkOutData);
    console.log("response==>=>=>",response.data);
    return response.data;
  } catch (error) {
    console.error("Error marking checkout:", error);
    throw error;
  }
};


export const fetchEmployeePersonalInfo = async () => {
  try {
    const response = await employeeInstance.get('/employee/api/employee/get-personalinfo', {
      withCredentials: true, 
    });

    console.log("emplolyee resposnce data",response.data);  
    return response.data;
  } catch (error) {
    console.error('Error fetching employee personal info:', error);
    throw error;
  }
};

export const uploadEmployeeProfileImage = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  try {
    const response = await employeeInstance.patch('/employee/api/employee/update-profilepicture', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
      toast.success('Profile picture updated successfully!');
      console.log("response data",response.data)
    return response.data.data;
  } catch (error) {
    console.error('Error uploading profile image:', error);
    throw error;
  }
};


export const updateEmployeePersonalInfo = async (details: any) => {

  try {
    const response = await employeeInstance.patch('/employee/api/employee/update-personalinfo', details);
    toast.success('Details updated successfully!');
    return response.data;
  } catch (error) {
    toast.error('Failed to update details!');
    throw error;
  }
};


export const fetchEmployeeAddress = async () => {
  try {
    const response = await employeeInstance.get('/employee/api/employee/get-address');
    return response.data;
  } catch (error) {
    console.error('Error fetching business owner address:', error);
    throw error;
  }
};


export const updateEmployeeAddress = async (address) => {
  try {
    const response = await employeeInstance.patch(
      "/employee/api/employee/update-address",
      address
    );
    console.log("Manager address updated successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error('Error updating manager address:', error.response?.data || error.message);
    throw error;
  }
};

  export const fetchEmployeeDocument = async () => {
    try {
      const response = await employeeInstance.get('/employee/api/employee/get-documents');
      console.log("responce is ==========&&&&========",response)
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch document.');
    }
  };
  
  export const updateEmployeeDocument= async (file: File) => {
  
    try {
      if (!file) {toast.error('No file selected.') ;return;}
      const formData = new FormData();
      formData.append('file', file);
      const response = await employeeInstance.patch('/employee/api/employee/update-documents', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Document uploaded successfully!');
      return response.data.result;
    } catch (error) {
      toast.error('Failed to upload document.');
    }
  };
  

export const fetchEmployeeCredential = async () => {
  try {
    const response = await employeeInstance.get(
      '/employee/api/employee/get-credentials'
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching employee credentials:', error);
    throw new Error('Failed to fetch employee credentials');
  }
};