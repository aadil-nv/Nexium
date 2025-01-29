import mongoose, { Schema, Document } from 'mongoose';
import { IProject } from '../entities/projectEntities';


const ProjectSchema = new Schema<IProject>(
  {
    projectName: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: ['notStarted', 'inProgress', 'completed', 'onHold', 'cancelled'],
      default: 'notStarted',
    },
    managerStatus: {
      type: String,
      enum: [
        'assigned',
        'underEvaluation',
        'approved',
        'rejected',
        'onHold',
        'inProgress',
        'requiresClarification',
        'escalated'
      ],
      default: 'assigned', // Default value set to 'pendingReview'
    },
    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Manager',
    },
    assignedEmployee: {
      employeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee', // Assuming Employee model is available

      },
      employeeName: {
        type: String,
      },
      employeeFiles: [
        {
          fileName: { type: String, },
          fileUrl: { type: String, },
          uploadedAt: { type: Date, default: Date.now },
        },
      ],
    },
    projectFiles: [
      {
        fileName: { type: String, },
        fileUrl: { type: String, },
        uploadedAt: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

const Project = mongoose.model<IProject>('Project', ProjectSchema);

export default Project;
