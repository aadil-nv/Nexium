import mongoose, { Schema, Document } from 'mongoose';
import {ILeaveType} from '../entities/leaveTypeEntities';
// Define the Leave schema to store leave types and their counts
const leaveSchema = new Schema(
  {
    sickLeave: { type: Number, required: true, default: 10 }, // Default max days for Sick Leave
    casualLeave: { type: Number, required: true, default: 12 }, // Default max days for Casual Leave
    maternityLeave: { type: Number, required: true, default: 180 }, // Maternity Leave default max days
    paternityLeave: { type: Number, required: true, default: 15 }, // Default max days for Paternity Leave
    paidLeave: { type: Number, required: true, default: 20 }, // Default max days for Paid Leave
    unpaidLeave: { type: Number, required: true, default: 0 }, // Default max days for Unpaid Leave
    compensatoryLeave: { type: Number, required: true, default: 5 }, // Default max days for Compensatory Leave
    bereavementLeave: { type: Number, required: true, default: 7 }, // Default max days for Bereavement Leave
    marriageLeave: { type: Number, required: true, default: 5 }, // Default max days for Marriage Leave
    studyLeave: { type: Number, required: true, default: 30 }, // Default max days for Study Leave
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Create the model
const Leave = mongoose.model<ILeaveType>('LeaveTypes', leaveSchema);

// TypeScript interface for the Leave document


export default Leave;
