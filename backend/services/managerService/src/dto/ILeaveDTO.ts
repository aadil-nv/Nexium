
import { Types } from "mongoose";
export interface ILeaveDTO {
    employeeId: string; // Convert to string as MongoDB ObjectId is not a string by default
    leaveType: string;
    date: Date | null;
    reason: string | null;
    hours: number;  
    status: "Pending" | "Approved" | "Rejected" | "null";
    leaveStatus?: "Pending" | "Approved" | "Rejected" | "null";
   
}

export interface ILeaveResonseDTO{
   
    leaveStatus?: "Pending"|"Approved"|"Rejected"|"null"
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

  
  


