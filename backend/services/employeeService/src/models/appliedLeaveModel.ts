  import mongoose, { Schema, Document } from 'mongoose';
  import { IAppliedLeave } from '../entities/appliedLeaveEntities';

  const AppliedLeaveSchema: Schema = new Schema(
    {
      employeeId: {
        type: mongoose.Schema.Types.ObjectId,ref: 'Employee',
        required: true,
      },
      leaveType: {
        type: String,  // This will store an array of leave types
        required: true,  // Ensure that at least one leave type is provided
      },
      reason: {
        type: String,
        required: true,  // Ensure reason is always provided
      },
      startDate: {
        type: Date,
        required: true,  // Ensure start date is always provided
      },
      endDate: {
        type: Date,
        required: true,  // Ensure end date is always provided
      },
      duration: {
        type: Number,  // Total duration of leave in days
        required: true,
      },
      status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending',
      },
      appliedAt: {
        type: Date,
        default: Date.now,  // Automatically set the applied date if not provided
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
        default: 0,  // This can be used to store total days applied for leave
      },
      isFirstHalf:{
        type: Boolean, 
        default: false 
      },
      isSecondHalf:{
        type: Boolean, 
        default: false 
      }
    },
    { timestamps: true } // Automatically adds createdAt and updatedAt fields
  );

  const AppliedLeave = mongoose.model<IAppliedLeave>('AppliedLeave', AppliedLeaveSchema);

  export default AppliedLeave;
