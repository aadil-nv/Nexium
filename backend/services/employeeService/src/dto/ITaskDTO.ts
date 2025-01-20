// DTO for creating or updating tasks for an employee
export interface ITaskDTO {
   _id?: any;
   employeeId: string; // Employee ID (string format for validation in request)
   dueDate: any; // Date for the task
   employeeName: string; // Name of the employee
   employeeProfilePicture: string; // Profile picture of the employee
   taskName: string; // Name of the task
   assignedBy?: string; // Optional, the ID of the employee who assigned the task (string format)
   assignedDate?: any; // Optional, date when the task was assigned
   isApproved?: boolean; // Optional, whether the task is approved (default: false)

   tasks: {
     title: string; // Title of the task
     description?: string; // Optional description
     isCompleted?: boolean; // Optional, defaults to false if not provided
     response?: string; // Optional, response related to the task
     priority?: "low" | "medium" | "high"; // Optional, defaults to "low" if not provided
     _id?: any; // Optional, task ID (use for updates or specific reference)
     taskStatus?: "backlog" |"inProgress" | "codeReview" | "qaTesting"| "completed" | "deployed"; // Optional, the task status
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

 export interface IGetEmployeeTaskDTO {
   _id?: any;
   employeeId: string; // Employee ID (string format for validation in request)
   dueDate: any; // Date for the task
   employeeName: string; // Name of the employee
   employeeProfilePicture: string; // Profile picture of the employee
   taskName: string; // Name of the task
   assignedBy?: string; // Optional, the ID of the employee who assigned the task (string format)
   assignedDate?: any; // Optional, date when the task was assigned
   isApproved?: boolean;
   tasks: {
      title: string; // Title of the task
      description?: string; // Optional description
      isCompleted?: boolean; // Optional, defaults to false if not provided
      response?: string; // Optional, response related to the task
      priority?: "low" | "medium" | "high"; // Optional, defaults to "low" if not provided
      _id?: any; // Optional, task ID (use for updates or specific reference)
      taskStatus?: "backlog" |"inProgress" | "codeReview" | "qaTesting"| "completed" | "deployed"; // Optional, the task status
    }[];
 }

 export interface IGetTaskDashboardData {
   totalTasks: number;
   completedTasks: number;
   pendingTasks: number;
   tasksByStatus: Record<string, number>;
   monthWiseCompletedTasks: Array<{
     month: string;
     completedCount: number;
   }>;

 }


 export interface MonthlyStatCount {
   status: string;
   count: number;
 }
 
 export interface TaskStatusCount {
   _id: string;
   count: number;
 }
 
 export interface MonthlyTaskData {
   month: string;
   completed: number;
   inProgress: number;
   backlog: number;
   blocked: number;
   total: number;
   totalCompleted: number;
 }
 
 export interface TaskStats {
   completed: number;
   inProgress: number;
   backlog: number;
   blocked: number;
   codeReview: number;
   qaTesting: number;
   deployed: number;
   approved: number;
 }
 
 export interface TaskPriorities {
   high: number;
   medium: number;
   low: number;
 }
 
 export interface DashboardResponse {
   employee: {
     name: string | undefined;
     profilePicture: string | undefined;
   };
   monthlyTaskData: MonthlyTaskData[];
   currentTaskStats: TaskStats;
   taskPriorities: TaskPriorities;
   totalTasks: number;
   totalCompletedTasks: number;
   lastUpdated: Date;
 }
 
 // Aggregation result interfaces
 export interface MonthlyAggregationResult {
   _id: {
     month: number;
     year: number;
   };
   statusCounts: {
     status: string;
     count: number;
   }[];
   totalTasks: number;
   totalCompletedTasks: number;
 }
 
 export interface StatusAggregationResult {
   _id: string;
   count: number;
   completedCount: number;
 }
 
 