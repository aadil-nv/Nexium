    export interface ILeaveDTO {
        leaveId?: any;           // Unique identifier for the leave
        employeeId?: any;     // Employee's unique identifier
        leaveType?: string;      // Type of the leave (e.g., "sickLeave", "casualLeave")
        reason?: string;         // Reason for applying the leave
        startDate?: Date;        // Start date of the leave
        endDate?: Date;          // End date of the leave
        duration?: number;       // Duration of the leave in days
        message?: string;        // Success or error message
        success?: boolean;       // Success status (true/false)
        appliedAt?: Date;        // Date when the leave was applied
        approvedBy?: string;       // Date when the leave was approved
        rejectionReason?: string; // Reason for rejection
        status?: string;
    }
  