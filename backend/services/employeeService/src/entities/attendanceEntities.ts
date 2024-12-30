import mongoose, { Document } from "mongoose";

export interface IAttendanceEntry {

    date: string;
    status: 'Present' | 'Leave' | 'Absent'|"Marked"|"Halfday";
    checkInTime: string | null;
    checkOutTime: string| null;
    minutes: number;
    duration?: string | null;
    leaveType?: string | null;
    reason?: string | null;
    leaveStatus?: string | null;
    rejectionReason?: string | null;
}

export interface IEmployeeAttendance extends Document {
    employeeId: mongoose.Types.ObjectId; // Reference to the Employee
    attendance: IAttendanceEntry[]; // Array of daily attendance
    
  }  




//!============================================================================
