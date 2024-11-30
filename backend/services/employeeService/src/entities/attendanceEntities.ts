import mongoose, { Document } from "mongoose";

export interface IAttendanceEntry {
    date: string;
    status: 'Present' | 'Leave' | 'Absent';
    checkInTime: string;
    checkOutTime: string;
    hours: number;
    leaveType?: string | null;
    reason?: string | null;
    fullDay: boolean;
}

export interface IEmployeeAttendance extends Document {
    employeeId: mongoose.Types.ObjectId; // Reference to the Employee
    attendance: IAttendanceEntry[]; // Array of daily attendance
    currentStatus: 'checkIn' | 'checkOut' | 'marked' | 'notMarked';
  }  




//!============================================================================

export interface IAttendanceEntry {
    date: string;
    status: 'Present' | 'Leave' | 'Absent';
    checkInTime: string;
    checkOutTime: string;
    hours: number;
    leaveType?: string | null;
    reason?: string | null;
    fullDay: boolean;
}