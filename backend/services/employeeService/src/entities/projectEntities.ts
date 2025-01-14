import mongoose, { Schema, Document } from 'mongoose';

export interface IFile {
    fileName: string;
    fileUrl: string;
    uploadedAt: Date;
  }
  
 export  interface IProject extends Document {
    projectName: string;
    description: string;
    startDate: Date;
    endDate: Date;
    status: 'notStarted' | 'inProgress' | 'completed' | 'onHold' | 'cancelled';
    managerStatus: 
    | 'assigned' 
    | 'underEvaluation' 
    | 'approved' 
    | 'rejected' 
    | 'onHold' 
    | 'inProgress' 
    | 'requiresClarification' 
    | 'escalated';
    assignedBy: mongoose.Schema.Types.ObjectId;
    assignedEmployee: {
      employeeId: mongoose.Schema.Types.ObjectId;
      employeeName: string;
      employeeFiles: IFile[];  // Files attached by the employee
    };
    projectFiles: IFile[];  // Files attached to the project itself
    createdAt: Date;
    updatedAt: Date;
  }