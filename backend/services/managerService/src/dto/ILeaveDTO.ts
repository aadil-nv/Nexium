
import { Types } from "mongoose";
export interface ILeaveDTO {
    employeeId: string; // Convert to string as MongoDB ObjectId is not a string by default
    leaveType: string;
    date: Date | null;
    reason: string | null;
    minutes: number;  
    duration: string | null;
    status: "Pending" | "Approved" | "Rejected" | "null";
    leaveStatus?: "Pending" | "Approved" | "Rejected" | "null";
    employeeName?: any;
    profilePicture?: any;
   
}

export interface ILeaveResonseDTO{
   
    leaveStatus?: string | null
    message?: string
    success?: boolean
}

export interface ILeaveTypesDTO {
    _id: any;
    sickLeave: number;
    casualLeave: number;
    maternityLeave: number;
    paternityLeave: number;
    paidLeave: number;
    unpaidLeave: number;
    compensatoryLeave: number;
    bereavementLeave: number;
    marriageLeave: number;
    studyLeave: number;
}

  
  


