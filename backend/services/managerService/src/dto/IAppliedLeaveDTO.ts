import { bool } from "aws-sdk/clients/signer";

// IAppliedLeaveDTO.ts
export interface IAppliedLeaveDTO {
    _id:any;
    employeeId: string;
    employeeName:string;
    profilePicture : string;
    leaveType: string;
    reason: string;
    startDate: string;  // Using string to ensure compatibility with Date string representation
    endDate: string;    // Same for endDate
    duration: number;
    status: 'pending' | 'approved' | 'rejected';
    appliedAt: string;  // Date string
    approvedBy?: string;
    rejectionReason?: string;
    daysCount: number;
  }
  
export interface IAppliedLeaveResponce  {
    message?:string;
    success?:boolean
    data?:any
}