import axios from "axios"
import { LoginFormData } from "../utils/interfaces"
import { managerInstance } from "../services/managerInstance";
import { IEmployee } from "../interface/managerInterface";
import { toast } from 'react-toastify';
import { message } from 'antd';

const baseURL= "/manager/api/"
export const managerLogin = async (formData: LoginFormData) => {
    try {
        const response = await axios.post('http://localhost:3000/authentication/api/manager/manager-login', formData, {
            withCredentials: true, 
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const resendOtp = async (email: string, url: string): Promise<{ success: boolean }> => {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    return await response.json();
  } catch {
    return { success: false };
  }
};


export const getAllManagers = async () => {
    try {
        const response = await managerInstance.get('/manager/api/manager/get-managers', {
            withCredentials: true, 
        });
        console.log("response==========",response.data)
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const validateOtp = async (otp: string ,email: string) => {
    try {
        const response = await axios.post('http://localhost:3000/authentication/api/manager/validate-otp', { otp, email }, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const fetchEmployeesAPI = async () => {
    const response = await managerInstance.get('/manager/api/employee/get-employees');
    return response.data;
  };
  
  export const fetchDepartmentsAPI = async () => {
    const response = await managerInstance.get('/manager/api/department/get-departments');
    console.log("response1111111111111111",response.data)
    return response.data;
};
  
export const removeDepartmentAPI = async (departmentId: string) => {
    await axios.delete('http://localhost:3000/manager/api/department/delete-department', {
      data: { departmentId },
    });
};

export const fetchEmployees = async (): Promise<IEmployee[]> => {
  try {
      const response = await managerInstance.get('/manager/api/employee/get-employees');

      console.log("===============response============", response.data);

      // Adjusting the mapping to match the provided data structure
      return response.data.map((employee: any) => ({
          _id: employee._id, // Directly from employee._id
          name: employee.employeeName || '', // Directly from employee.employeeName
          position: employee.position || '', // Directly from employee.position
          profilePicture: employee.profilePicture || '', // Directly from employee.profilePicture
          isOnline: employee.isActive || false, // Directly from employee.isActive
          email:employee.email
      }));
  } catch (error) {
      console.error('Error fetching employee data:', error);
      throw error;
  }
};



export const fetchDepartments = async () => {
    try {
      const response = await managerInstance.get('/manager/api/department/get-departments');
      if (response.status === 200) {
        return response.data.map((department: { departmentName: string }) => department.departmentName);
      }
      throw new Error('Failed to fetch departments!');
    } catch (error) {
      toast.error('An error occurred while fetching departments!');
      console.error('Error:', error);
      throw error;
    }
  };
  
export const addEmployee = async (employeeData: any) => {
  console.log("employeeData",employeeData)
    try {
      const response = await managerInstance.post('/manager/api/department/add-employee', { employeedata: employeeData }, {
        withCredentials: true,
      });

      console.log("response111111111111111111111111",response)
  
      if (response.status === 200) {
        toast.success('Employee added successfully!');
        return true;
      } else {
        toast.error('Failed to add the employee!');
        return false;
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'An error occurred!');
      console.error('Error:', error);
      throw error;
    }
  };

  export const removeEmployee = async (employeeId: string, departmentId: string) => {
    try {
      const response = await axios.patch(
        'http://localhost:3000/manager/api/department/remove-employee',
        {
          employeeId, // employee ID to be removed
          departmentId, // department ID
        }
      );
      return response.data; // Return the response data on success
    } catch (error) {
      throw new Error('Error removing employee');
    }
  };  
  

  export async function fetchManagerPersonalInfo(): Promise<any> {

  
      try {
          const response = await managerInstance.get(`/manager/api/manager/get-managerpersonalinfo`, {
              headers: {
                  "Content-Type": "application/json",
              },
          });
          console.log("Manager personal info:", response);
          
          return response.data;
      } catch (error) {
          console.error("Error fetching manager personal info:", error);
          throw error;
      }
  }
  

  export const fetchManagerAddress = async () => {
    try {
      const response = await managerInstance.get('/manager/api/manager/get-manageraddress');
      console.log("*******************",response)
      return response.data;
    } catch (error) {
      console.error('Error fetching business owner address:', error);
      throw error;
    }
  };


  export const updateManagerPersonalInfo = async (details: any): Promise<void> => {
    try {
      await managerInstance.patch(
        '/manager/api/manager/update-personalinfo',
        details
      );
      message.success('Details updated successfully!');
    } catch (error) {
      message.error('Failed to update details.');
      throw error;
    }
  };

  export const updateManagerAddress = async (address) => {
    try {
      const response = await managerInstance.patch(
        "/manager/api/manager/update-address",
        address
      );
      console.log("Manager address updated successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error('Error updating manager address:', error.response?.data || error.message);
      throw error;
    }
  };