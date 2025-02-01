import axios from "axios"
import { LoginFormData } from "../utils/interfaces"
import { managerInstance } from "../services/managerInstance";
import { IEmployee } from "../interface/managerInterface";
import { toast } from 'react-toastify';
import { message } from 'antd';
import { fetchLeaveEmployeesRequest ,fetchLeaveEmployeesFailure,fetchLeaveEmployeesSuccess} from "../redux/slices/leaveSlice";
import { Dispatch } from 'redux';


interface Attendance {
  leaveType: string;
  date: string;
  leaveStatus: string;
  reason: string;
}

interface LeaveEmployee {
  _id: string;
  attendance: Attendance[];
}

interface LeaveData {
  employeeName: string;
  leaveType: string;
  leaveDate: string;
  status: string;
  reason: string;
}

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


export const managerLogin = async (formData: LoginFormData) => {
        const response = await axios.post('https://backend.aadil.online/authentication-service/api/manager/manager-login', formData, {
            withCredentials: true, 
        });
        return response.data;
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
        const response = await managerInstance.get('/manager-service/api/manager/get-managers', {withCredentials: true, });
        return response.data;
};

export const validateOtp = async (otp: string ,email: string) => {
   
    const response = await axios.post('https://backend.aadil.online/authentication-service/api/manager/validate-otp', { otp, email }, {withCredentials: true,});
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
      toast.error('An error occurred while fetching departments!');
      console.error('Error:', error);
      throw error;
    }
};
  
export const addEmployee = async (employeeData :IEmployee) => {
    try {
      const response = await managerInstance.post('/manager-service/api/employee/add-employees', { employeedata: employeeData }, {
        withCredentials: true,
      });

      if (response.status === 200) {
        toast.success('Employee added successfully!');
        return true;
      } else {
        toast.error('Failed to add the employee!');
        return false;
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'An error occurred!');
    return false;
    }
};

export const addEmployeeToDepartment = async (employeeData:IEmployee  ,departmentId : string) => {
      try {
        const response = await managerInstance.post('/manager-service/api/department/add-employee', { employeeData , departmentId }, {
          withCredentials: true,
        });
        console.log("Added employeed to department",response.data);
        
    
        if (response.status === 200) {
          toast.success('Employee added successfully!');
          return true;
        } else {
          toast.error('Failed to add the employee!');
          return false;
        }
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'An error occurred!');
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
        toast.success('Manager profile picture updated successfully!');
        return response.data.data.imageUrl;
      }
    } catch (error) {
      console.log("Error updating manager profile picture:", error);
      toast.error('Failed to update manager profile picture.');
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
      if (!file) {toast.error('No file selected.') ;return;}
      const formData = new FormData();
      formData.append('file', file);
      const response = await managerInstance.post('/manager-service/api/manager/update-documents', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Document uploaded successfully!');
      return response.data.result;
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message || 'Failed to upload document.');
      } else {
        toast.error('An unexpected error occurred while uploading the document.');
      }
    }
  };
  

  export const fetchManagerCredential = async () => {
    try {
      const response = await managerInstance.get('/manager-service/api/manager/get-managercredentials');
      return response.data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message || 'Failed to fetch manager credentials.');
      } else {
        toast.error('An unexpected error occurred while fetching manager credentials.');
      }
    }
  };