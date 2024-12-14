
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