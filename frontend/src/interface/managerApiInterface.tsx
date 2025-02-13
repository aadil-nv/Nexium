export interface Attendance {
    leaveType: string;
    date: string;
    leaveStatus: string;
    reason: string;
  }
  
  export interface LeaveEmployee {
    _id: string;
    attendance: Attendance[];
  }
  
  export interface LeaveData {
    employeeName: string;
    leaveType: string;
    leaveDate: string;
    status: string;
    reason: string;
  }
  
  export interface AddressData {
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  }
  
  export interface CommonInfo {
    email: string;
    phone: string;
    profilePicture?: string;
    personalWebsite?: string;
  }
  export interface UpdateDepartmentResponse {
    message: string;
    department?: string; // Replace `any` with the actual department type if known
  }