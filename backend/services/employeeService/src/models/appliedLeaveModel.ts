import mongoose, { Schema, Document } from 'mongoose';
import  {IAppliedLeave}  from '../entities/leaveTypeEntities';

const AppliedLeaveSchema: Schema = new Schema(
  {
    employeeId: {
      type: String,
      required: true,
    },
    leaveType: {
      type: String,
      required: true,
    },
    reason: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    duration: {
      type: Number,  // Duration in days (could be fractional like 0.5 for half-day leave)
      required: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected'],
      default: 'Pending',
    },
    appliedAt: {
      type: Date,
      default: Date.now,
    },
    approvedBy: {
      type: String,
      required: false,
    },
    rejectionReason: {
      type: String,
      required: false,
    },
    daysCount: {
      type: Number,
      required: true,
      default: 0,  // Initial value
    },
  },
  { timestamps: true } // automatically adds createdAt and updatedAt
);

  
const AppliedLeave = mongoose.model<IAppliedLeave>('AppliedLeave', AppliedLeaveSchema);

export default AppliedLeave;
