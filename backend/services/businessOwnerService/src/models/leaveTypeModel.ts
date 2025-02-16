import mongoose, { Schema, Document } from 'mongoose';
import {ILeaveType} from '../entities/leaveTypeEntities';
const leaveSchema = new Schema(
  {
    businessOwnerId: { type: mongoose.Schema.Types.ObjectId, ref: 'BusinessOwner', required: true }, 
    sickLeave: { type: Number, required: true, default: 0 }, 
    casualLeave: { type: Number, required: true, default: 0 }, 
    maternityLeave: { type: Number, required: true, default: 0 }, 
    paternityLeave: { type: Number, required: true, default: 0 }, 
    paidLeave: { type: Number, required: true, default: 0 }, 
    unpaidLeave: { type: Number, required: true, default: 0 }, 
    compensatoryLeave: { type: Number, required: true, default: 0 }, 
    bereavementLeave: { type: Number, required: true, default: 0 }, 
    marriageLeave: { type: Number, required: true, default: 0 }, 
    studyLeave: { type: Number, required: true, default: 0 }, 
  },
  {
    timestamps: true, 
  }
);

// Create the model
const Leave = mongoose.model<ILeaveType>('LeaveTypes', leaveSchema);

export default Leave;
