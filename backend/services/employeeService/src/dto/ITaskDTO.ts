// DTO for creating or updating tasks for an employee
export interface ITaskDTO {
    employeeId: string; // Employee ID (string format for validation in request)
    dueDate: Date; // Date for the tasks
    employeeName: string; // Name of the employee
    employeeProfilePicture: string; // Profile picture of the employee
    tasks: {
      title: string; // Title of the task
      description?: string; // Optional description
      isCompleted?: boolean; // Optional, defaults to false if not provided
      priority?: "low" | "medium" | "high"; // Optional, defaults to "low" if not provided
    }[]; // Array of task items
  }
  

 export interface IGetEmployeeWithoutTaskDTO {
    _id: string;
    name: string;
    email: string;
    position: string;
    profilePicture: string;
    isActive: boolean;
 }

 export interface ITaskResponceDTO{
    message: string;
    success: boolean
 }