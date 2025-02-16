import axios, { AxiosError } from "axios"
import { LoginFormData } from "../utils/interfaces"
import { managerInstance } from "../services/managerInstance";
import { IEmployee } from "../interface/managerInterface";
import { message } from 'antd';
import { fetchLeaveEmployeesRequest ,fetchLeaveEmployeesFailure,fetchLeaveEmployeesSuccess} from "../redux/slices/leaveSlice";
import { Dispatch } from 'redux';
import {AddressData,CommonInfo,LeaveData,LeaveEmployee,UpdateDepartmentResponse} from "../interface/managerApiInterface"


const API_URL = import.meta.env.VITE_API_KEY as string


export const managerLogin = async (formData: LoginFormData) => {
        const response = await axios.post(`${API_URL}/authentication-service/api/manager/manager-login`, formData, {
            withCredentials: true, 
        });
        return response.data;
};

export const resendOtp = async (email: string): Promise<{ success: boolean }> => {
  try {
    const { data } = await axios.post(`${API_URL}/authentication-service/api/manager/resend-otp`, { email });
    return data;
  } catch {
    return { success: false };
  }
};

export const getAllManagers = async () => {
        const response = await managerInstance.get('/manager-service/api/manager/get-managers', {withCredentials: true, });
        return response.data;
};

export const validateOtp = async (otp: string ,email: string) => { 
    const response = await axios.post(`${API_URL}/authentication-service/api/manager/validate-otp`, { otp, email }, {withCredentials: true,});
    return response.data;
};

export const fetchEmployeesAPI = async () => {
    const response = await managerInstance.get('/manager-service/api/employee/get-employees');
    return response.data;
};

export const fetchEmployeesWithOutDepAPI = async () => {
    const response = await managerInstance.get('/manager-service/api/employee/get-employee-without-department');
    return response.data;
};
  
export const fetchDepartmentsAPI = async () => {
    const response = await managerInstance.get('/manager-service/api/department/get-departments');
    return response.data;
};
  
export const removeDepartmentAPI = async (departmentId: string) => {
   const response = await managerInstance.delete('/manager-service/api/department/delete-department', {data: { departmentId },});
    return response.data;
};

export const fetchEmployees = async (): Promise<IEmployee[]> => {
  try {
      const response = await managerInstance.get('/manager-service/api/employee/get-employees');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return response.data.map((employee :any) => ({
          employeeId: employee._id,
          name: employee.employeeName || '', 
          position: employee.position || '', 
          profilePicture: employee.profilePicture || '',
          isOnline: employee.isActive || false, 
          email:employee.email,
          isBlocked: employee.isBlocked || false
      }));
  } catch (error) {
      console.error('Error fetching employee data:', error);
      throw error;
  }
};

export const fetchEmployeesWithOutDepartment = async (): Promise<IEmployee[]> => { 
  try {
    const response = await managerInstance.get('/manager-service/api/employee/get-employee-without-department');

    return response.data.map((employee: { 
      employeeId: string; 
      employeeName: string; 
      position: string; 
      profilePicture: string; 
      isActive: boolean; 
      email: string; 
      isBlocked: boolean; 
    }): IEmployee => ({
      employeeId: employee.employeeId, 
      name: employee.employeeName || '', 
      position: employee.position || '', 
      profilePicture: employee.profilePicture || '', 
      isOnline: employee.isActive || false, 
      email: employee.email,
      isBlocked: employee.isBlocked || false
    }));
  } catch (error) {
    console.error('Error fetching employee data:', error);
    throw error;
  }
};

export const fetchDepartments = async () => {
    try {
      const response = await managerInstance.get('/manager-service/api/department/get-departments');
      if (response.status === 200) {
        return response.data.map((department: { departmentName: string }) => department.departmentName);
      }
      throw new Error('Failed to fetch departments!');
    } catch (error) {
      message.error('An error occurred while fetching departments!');
      console.error('Error:', error);
      throw error;
    }
};
  
export const addEmployee = async (employeeData :IEmployee) => {
    try {
      const response = await managerInstance.post('/manager-service/api/employee/add-employees', { employeedata: employeeData }, {
        withCredentials: true,
      });
      console.log("Added employeed",response);
      

      if (response.status === 200) {
        message.success('Employee added successfully!');
        return true;
      } else {
        message.error('Failed to add the employee!');
        return false;
      }
    }catch (error) {
        if (axios.isAxiosError(error)) {
          message.error(error.response?.data?.message || 'An error occurred!');
        } else {
          message.error('An unexpected error occurred!');
        }
        return false;
      }
};

export const addEmployeeToDepartment = async (employeeData:IEmployee  ,departmentId : string) => {
      try {
        const response = await managerInstance.post('/manager-service/api/department/add-employee', { employeeData , departmentId }, {
          withCredentials: true,
        });
        
    
        if (response.status === 200) {
          message.success('Employee added successfully!');
          return true;
        } else {
          message.error('Failed to add the employee!');
          return false;
        }
      } catch (error) {
        message.error(error instanceof Error ? error.message : 'An error occurred!');
        return false;
      }
};

export const removeEmployee = async (employeeId: string, departmentId: string) => {
    try {
      const response = await managerInstance.post(
        '/manager-service/api/department/remove-employee',
        {
          employeeId, // employee ID to be removed
          departmentId, // department ID
        }
      );
      return response.data; // Return the response data on success
    } catch (error) {
      console.log("Error removing employee:", error);
      throw new Error('Error removing employee');
    }
};  
  

export async function fetchManagerPersonalInfo() {
      try {
          const response = await managerInstance.get(`/manager-service/api/manager/get-managerpersonalinfo`, {
              headers: {
                  "Content-Type": "application/json",
              },
          });          
          return response.data;
      } catch (error) {
          console.error("Error fetching manager personal info:", error);
          throw error;
      }
}

export async function updateManagerProfilePicture (file: File) {
    const formData = new FormData();
    formData.append('file', file);
    try {
      const response = await managerInstance.patch(
        '/manager-service/api/manager/update-profile-picture',
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
  
      if (response.status === 200) {
        message.success('Manager profile picture updated successfully!');
        return response.data.data.imageUrl;
      }
    } catch (error) {
      console.log("Error updating manager profile picture:", error);
      message.error('Failed to update manager profile picture.');
    }
};

export const fetchManagerAddress = async () => {
    try {
      const response = await managerInstance.get('/manager-service/api/manager/get-manageraddress');
      return response.data;
    } catch (error) {
      console.error('Error fetching business owner address:', error);
      throw error;
    }
};


export const updateManagerPersonalInfo = async (details : CommonInfo): Promise<void> => {
    try {
      await managerInstance.patch(
        '/manager-service/api/manager/update-personalinfo',
        details
      );
      message.success('Details updated successfully!');
    } catch (error) {
      message.error('Failed to update details.');
      throw error;
    }
};

export const updateManagerAddress = async (address:AddressData ) => {
    try {
      const response = await managerInstance.patch( "/manager-service/api/manager/update-address",address);
      return response.data;
    } catch (error) {
      console.error('Error updating manager address:', error);
      throw error;
    }
  };

  export const fetchLeaveEmployees = async () => {
    try {
      const { data } = await managerInstance.get('/manager-service/api/leave/get-all-leave-employees');

      return data
    } catch (error) {
      console.error('Error fetching leave employees:', error);
      throw new Error('Failed to fetch leave employees');
    }
  };
  
  export const fetchLeaveEmployeesOne = () => async (dispatch: Dispatch) => {
    try {
      dispatch(fetchLeaveEmployeesRequest()); // Set loading state before fetching
  
      const { data } = await managerInstance.get<LeaveEmployee[]>('/manager-service/api/manager/get-leave-employees');
  
      const leaveData: LeaveData[] = data.map((item) => ({
        employeeName: item._id,
        leaveType: item.attendance[0]?.leaveType || 'N/A',
        leaveDate: item.attendance[0]?.date || 'N/A',
        status: item.attendance[0]?.leaveStatus || 'Pending',
        reason: item.attendance[0]?.reason || 'No reason provided',
      }));
  
      dispatch(fetchLeaveEmployeesSuccess(leaveData)); // Dispatch success action with fetched data
    } catch (error) {
      console.error('Error fetching leave employees:', error);
      dispatch(fetchLeaveEmployeesFailure('Failed to fetch leave data')); // Dispatch failure action on error
    }
  };


  export const updateLeaveApproval = async (employeeId: string, data: { action: string; date: string | undefined; leaveType: string; duration: string; reason?: string; }) => {
    try {
      const response = await managerInstance.patch(`/manager-service/api/leave/update-leave-approval/${employeeId}`, data);
      return response.data; 
    } catch (error) {
      if (error instanceof Error) {
        const axiosError = error as { response?: { data?: { message?: string } } };
        throw new Error(axiosError.response?.data?.message || 'Failed to update leave approval');
      } else {
        throw new Error('An unexpected error occurred while updating leave approval.');
      }
    }
  };

  export const fetchManagerDocument = async () => {
    try {
      const response = await managerInstance.get('/manager-service/api/manager/get-managerdocuments');
      return response.data.resume;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(error.message || 'Failed to fetch manager documents');
      } else {
        throw new Error('An unexpected error occurred while fetching manager documents');
      }
    }
  };
  
  export const updateManagerOwnerDocument   = async (file: File) => {
    try {
      if (!file) {message.error('No file selected.') ;return;}
      const formData = new FormData();
      formData.append('file', file);
      const response = await managerInstance.post('/manager-service/api/manager/update-documents', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      message.success('Document uploaded successfully!');
      return response.data.result;
    } catch (error: unknown) {
      if (error instanceof Error) {
        message.error(error.message || 'Failed to upload document.');
      } else {
        message.error('An unexpected error occurred while uploading the document.');
      }
    }
  };
  

  export const fetchManagerCredential = async () => {
    try {
      const response = await managerInstance.get('/manager-service/api/manager/get-managercredentials');
      return response.data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        message.error(error.message || 'Failed to fetch manager credentials.');
      } else {
        message.error('An unexpected error occurred while fetching manager credentials.');
      }
    }

  };

  export const updateDepartmentName = async (departmentId: string,newDepartmentName: string): Promise<UpdateDepartmentResponse> => {
    try {
      const response = await managerInstance.patch<UpdateDepartmentResponse>(
        `/manager-service/api/department/update-department-name/${departmentId}`,
        { newDepartmentName }
      );
      return response.data;
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ message: string }>;
      
      if (axiosError.response?.data?.message) {
        message.error(axiosError.response.data.message);
        throw new Error(axiosError.response.data.message);
      }
  
      console.error("Error updating department name:", axiosError.message);
      throw new Error("Failed to update department name");
    }
  };