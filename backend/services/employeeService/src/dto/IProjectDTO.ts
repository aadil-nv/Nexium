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

export interface IGetProjectDashboardData {
    totalProjects: number; // Total number of projects
    completedProjects: number; // Total number of completed projects
    inProgressProjects: number; // Total number of in-progress projects
    onHoldProjects: number; // Total number of on-hold projects
    monthWiseCompletedProjects: { // Month-wise breakdown of completed projects
      month: string; // Month name (e.g., 'January')
      completedCount: number; // Number of completed projects in that month
    }[];
    recentProjects: { // Recent projects (e.g., top 5)
      projectName: string; // Name of the project
      description: string; // Description of the project
      startDate: Date; // Start date of the project
      endDate: Date; // End date of the project
      status: 'notStarted' | 'inProgress' | 'completed' | 'onHold' | 'cancelled'; // Status of the project
      assignedEmployee: string; // Employee assigned to the project (employee's name)
    }[];
  }
  
  