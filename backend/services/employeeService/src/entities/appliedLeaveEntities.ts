import mongoose, { Schema, Document } from 'mongoose';

export interface IAppliedLeave extends Document {
    employeeId: mongoose.Types.ObjectId;            // Employee's unique identifier
    leaveType: string;        // Array of leave types (e.g., ['sickLeave', 'casualLeave'])
    reason: string;                // Reason for applying the leave
    startDate: Date;               // Start date of the leave
    endDate: Date;                 // End date of the leave
    duration: number;              // Duration of the leave in days
    status: 'pending' | 'approved' | 'rejected';  // Status of the leave
    appliedAt: Date;               // Date when the leave was applied
    approvedBy?: string;           // ID of the approver (if applicable)
    rejectionReason?: string;      // Reason for rejection (if applicable)
    daysCount: number;             // Total number of days applied
    isFirstHalf:boolean
    isSecondHalf:boolean
}
