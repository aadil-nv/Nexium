import mongoose, { Document } from "mongoose";

export interface ITask extends Document {
  _id: mongoose.Types.ObjectId;
  employeeId: mongoose.Types.ObjectId; // Reference to the employee
  dueDate: Date; // Date for the task
  employeeName: string; // Name of the employee assigned the task
  employeeProfilePicture: string; // URL or path of the employee's profile picture
  taskName: string; // Name of the task
  assignedBy: string; // Reference to the employee who assigned the task
  assignedDate: Date; // Date when the task was assigned
  isApproved: boolean; // Whether the task has been approved

  tasks: {
    title: string; // Title of the task
    description?: string; // Optional description of the task
    isCompleted: boolean; // Whether the task is completed
    priority: "low" | "medium" | "high"; // Priority of the task
    _id: mongoose.Types.ObjectId; // Task's unique ID
    taskStatus: "backlog" |"inProgress" | "codeReview" | "qaTesting"| "completed" | "deployed" ; // Status of the task
    response: string; // Response related to the task
  }[];
  createdAt: Date; // Timestamp when the task was created
  updatedAt: Date; // Timestamp when the task was last updated
}
