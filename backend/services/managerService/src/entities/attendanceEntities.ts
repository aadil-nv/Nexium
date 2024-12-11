import mongoose, { Document } from "mongoose";

export interface IAttendanceEntry {
    date: string;
    status: 'Present' | 'Leave' | 'Absent'|"marked";
    checkInTime: string;
    checkOutTime: string;
    hours: number;
    leaveType?: string | null;
    reason?: string | null;
    leaveStatus?: "Pending"|"Approved"|"Rejected"|"null"
}

export interface IEmployeeAttendance extends Document {
    employeeId: mongoose.Types.ObjectId; // Reference to the Employee
    attendance: IAttendanceEntry[]; // Array of daily attendance
  }  




//!============================================================================

