import { toast } from "react-toastify";
import { employeeInstance } from "../services/employeeInstance";

interface AddressData {
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}

interface CommonInfo {
  email: string;
  phone: string;
  profilePicture?: string;
  personalWebsite?: string;
}



export const fetchAttendanceData = async () => {
  try {
    const response = await employeeInstance.get("/employee-service/api/attendance/get-attendances");
    return response.data;
  } catch (error) {
    console.error("Error fetching attendance data:", error);
    throw error; // or return a default value
  }
};

export const markCheckIn = async (checkInData: { date: string; checkInTime: string; } ) => {
  try {
    const response = await employeeInstance.post("/employee-service/api/attendance/mark-checkin/", checkInData);
    return response.data;
  } catch (error) {
    console.error("Error marking check-in:", error);
    throw error;
  }
};

export const markCheckOut = async (checkOutData: { checkOutTime: string; date: string; }) => {
  try {
    const response = await employeeInstance.post("/employee-service/api/attendance/mark-checkout", checkOutData);
    console.log("response==>=>=>",response.data);
    return response.data;
  } catch (error) {
    console.error("Error marking checkout:", error);
    throw error;
  }
};


export const fetchEmployeePersonalInfo = async () => {
  try {
    const response = await employeeInstance.get('/employee-service/api/employee/get-personalinfo', {
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
    const response = await employeeInstance.patch('/employee-service/api/employee/update-profilepicture', formData, {
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


export const updateEmployeePersonalInfo = async (details : CommonInfo ) => {
    
  try {
    const response = await employeeInstance.patch('/employee-service/api/employee/update-personalinfo', details);
    toast.success('Details updated successfully!');
    return response.data;
  } catch (error) {
    toast.error('Failed to update details!');
    throw error;
  }
};


export const fetchEmployeeAddress = async () => {
  try {
    const response = await employeeInstance.get('/employee-service/api/employee/get-address');
    return response.data;
  } catch (error) {
    console.error('Error fetching business owner address:', error);
    throw error;
  }
};


export const updateEmployeeAddress = async (address: AddressData) => {
  try {
    const response = await employeeInstance.patch(
      "/employee-service/api/employee/update-address",
      address
    );
    console.log("Manager address updated successfully:", response.data);
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error updating manager address:', error.message);
      throw new Error(error.message);
    } else {
      console.error('Error updating manager address:', error);
      throw new Error('An unknown error occurred');
    }
  }
};

  export const fetchEmployeeDocument = async () => {
    try {
      const response = await employeeInstance.get('/employee-service/api/employee/get-documents');
      return response.data;
    } catch (error) {
      console.log("Error fetching document:", error);
      throw new Error('Failed to fetch document.');
    }
  };
  
  export const updateEmployeeDocument= async (file: File) => {
    try {
      if (!file) {toast.error('No file selected.') ;return;}
      const formData = new FormData();
      formData.append('file', file);
      const response = await employeeInstance.patch('/employee-service/api/employee/update-documents', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Document uploaded successfully!');
      return response.data.result;
    } catch (error) {
      console.log("Error uploading document:", error);
      toast.error('Failed to upload document.');
    }
  };
  

export const fetchEmployeeCredential = async () => {
  try {
    const response = await employeeInstance.get(
      '/employee-service/api/employee/get-credentials'
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching employee credentials:', error);
    throw new Error('Failed to fetch employee credentials');
  }
};