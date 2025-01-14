import { IFile } from "../entities/projectEntities";
import mongoose from "mongoose";


export interface IProjectResponseDTO {
    message?:string;
    success?:boolean
}

export interface IProjectDTO {
    projectId: any;
    projectName: string;
    description: string;
    startDate: Date;
    endDate: Date;
    status: 'notStarted' | 'inProgress' | 'completed' | 'onHold' | 'cancelled';
    managerStatus: | 'assigned' | 'underEvaluation' | 'approved' | 'rejected' | 'onHold' | 'inProgress' | 'requiresClarification'| 'escalated';
    assignedEmployee: {
        employeeId: mongoose.Schema.Types.ObjectId;
        employeeName: string;
        employeeFiles: IFile[];
    };
    projectFiles: IFile[];
    createdAt: Date;
    updatedAt: Date;
}