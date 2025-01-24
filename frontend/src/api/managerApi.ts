import axios from "axios"
import { LoginFormData } from "../utils/interfaces"
import { managerInstance } from "../services/managerInstance";
import { IEmployee } from "../interface/managerInterface";
import { toast } from 'react-toastify';
import { message } from 'antd';
import { fetchLeaveEmployeesRequest ,fetchLeaveEmployeesFailure,fetchLeaveEmployeesSuccess} from "../redux/slices/leaveSlice";
import { Dispatch } from 'redux';





export const managerLogin = async (formData: LoginFormData) => {
        const response = await axios.post('http://localhost:3000/authentication/api/manager/manager-login', formData, {
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
        const response = await managerInstance.get('/manager/api/manager/get-managers', {withCredentials: true, });
        return response.data;
};

export const validateOtp = async (otp: string ,email: string) => {
   
    const response = await axios.post('http://localhost:3000/authentication/api/manager/validate-otp', { otp, email }, {withCredentials: true,});
    return response.data;
};

export const fetchEmployeesAPI = async () => {
    const response = await managerInstance.get('/manager/api/employee/get-employees');
    return response.data;
};

export const fetchEmployeesWithOutDepAPI = async () => {
    const response = await managerInstance.get('/manager/api/employee/get-employee-without-department');
    return response.data;
};
  
export const fetchDepartmentsAPI = async () => {
    const response = await managerInstance.get('/manager/api/department/get-departments');
    return response.data;
};
  
export const removeDepartmentAPI = async (departmentId: string) => {
   const response = await managerInstance.delete('/manager/api/department/delete-department', {data: { departmentId },});
    return response.data;
};

export const fetchEmployees = async (): Promise<IEmployee[]> => {
  try {
      const response = await managerInstance.get('/manager/api/employee/get-employees');
      return response.data.map((employee) => ({
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
      const response = await managerInstance.get('/manager/api/employee/get-employee-without-department');

      return response.data.map((employee) => ({
          employeeId: employee.employeeId, 
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
  
export const addEmployee = async (employeeData) => {
    try {
      const response = await managerInstance.post('/manager/api/employee/add-employees', { employeedata: employeeData }, {
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
      toast.error(error.response?.data?.message || 'An error occurred!');
      console.error('Error:', error);
      throw error;
    }
};

export const addEmployeeToDepartment = async (employeeData ,departmentId) => {
      try {
        const response = await managerInstance.post('/manager/api/department/add-employee', { employeeData , departmentId }, {
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
        toast.error(error.response?.data?.message || 'An error occurred!');
        console.error('Error:', error);
        throw error;
      }
};

export const removeEmployee = async (employeeId: string, departmentId: string) => {
    try {
      const response = await managerInstance.post(
        '/manager/api/department/remove-employee',
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

export async function updateManagerProfilePicture (file: File) {
    const formData = new FormData();
    formData.append('file', file);
    try {
      const response = await managerInstance.patch(
        '/manager/api/manager/update-profile-picture',
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
      const response = await managerInstance.get('/manager/api/manager/get-manageraddress');
      return response.data;
    } catch (error) {
      console.error('Error fetching business owner address:', error);
      throw error;
    }
};


export const updateManagerPersonalInfo = async (details): Promise<void> => {
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

  export const fetchLeaveEmployees = async () => {
    try {
      const { data } = await managerInstance.get('/manager/api/leave/get-all-leave-employees');

      return data.map((item) => ({
        employeeId: item.employeeId, 
        leaveType: item.leaveType,
        leaveDate: item.date ? new Date(item.date) : null, 
        leaveStatus: item.leaveStatus, 
        reason: item.reason ,
        minutes: item.minutes || 0,
        status: item.status ,
        duration: item.duration
      }));
    } catch (error) {
      console.error('Error fetching leave employees:', error);
      throw new Error('Failed to fetch leave employees');
    }
  };
  
  

  export const fetchLeaveEmployeesOne = () => async (dispatch: Dispatch) => {
    try {
      dispatch(fetchLeaveEmployeesRequest()); // Set loading state before fetching
  
      const { data } = await managerInstance.get('/manager/api/manager/get-leave-employees');
      const leaveData = data.map((item) => ({
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



  export const updateLeaveApproval = async (employeeId, data) => {
    try {
      const response = await managerInstance.patch(`/manager/api/leave/update-leave-approval/${employeeId}`, data);
      return response.data; 
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update leave approval');
    }
  };

 

  export const fetchManagerDocument = async () => {
    try {
      const response = await managerInstance.get('/manager/api/manager/get-managerdocuments');
      console.log("responce is ==========&&&&========",response.data.resume)
      return response.data.resume;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch manager documents');
    }
  };
  
  export const updateManagerOwnerDocument   = async (file: File) => {
    try {
      if (!file) {toast.error('No file selected.') ;return;}
      const formData = new FormData();
      formData.append('file', file);
      const response = await managerInstance.post('/manager/api/manager/update-documents', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Document uploaded successfully!');
      return response.data.result;
    } catch (error) {
      toast.error(error.response?.data?.message ||'Failed to upload document.');
    }
  };
  

  export const fetchManagerCredential = async () => {
    try {
      const response = await managerInstance.get('/manager/api/manager/get-managercredentials');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message ||'Failed to fetch business owner credentials');
    }
  };