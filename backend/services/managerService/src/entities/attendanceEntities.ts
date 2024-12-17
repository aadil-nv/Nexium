import mongoose, { Document } from "mongoose";

export interface IAttendanceEntry {
    _id?: mongoose.Types.ObjectId;
    date: string;
    status: 'Present' | 'Leave' | 'Absent'|"marked";
    checkInTime: string | null;
    checkOutTime: string| null;
    hours: number;
    leaveType?: string | null;
    reason?: string | null;
    leaveStatus?: "Pending"|"Approved"|"Rejected"|"null"
    rejectionReason?: string | null;
}

export interface IEmployeeAttendance extends Document {
    employeeId: mongoose.Types.ObjectId; // Reference to the Employee
    attendance: IAttendanceEntry[]; // Array of daily attendance
    
  }  




//!============================================================================
