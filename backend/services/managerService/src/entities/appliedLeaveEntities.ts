import mongoose, { Schema, Document } from 'mongoose';

export interface IAppliedLeave extends Document {
    employeeId: any;           
    leaveType: string;       
    reason: string;               
    startDate: Date;              
    endDate: Date;                
    duration: number;              
    status: 'pending' | 'approved' | 'rejected'; 
    appliedAt: Date;               
    approvedBy?: string;           
    rejectionReason?: string;     
    daysCount: number;             
}
