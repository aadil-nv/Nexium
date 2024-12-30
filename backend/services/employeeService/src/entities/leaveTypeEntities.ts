
import mongoose, { Schema, Document } from 'mongoose';


export interface ILeaveType extends Document {
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

  export  interface IAppliedLeave extends Document {
    employeeId: string;
    leaveType: string;
    reason: string;
    startDate: Date;
    endDate: Date;
    duration: number;   // Duration in days
    status: 'Pending' | 'Approved' | 'Rejected';
    appliedAt: Date;
    approvedBy?: string;
    rejectionReason?: string;
    daysCount: number;  // Days count based on startDate and endDate
  } 