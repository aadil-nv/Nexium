import mongoose, { Document } from "mongoose";

export interface ITask extends Document {
    _id: mongoose.Types.ObjectId;
    employeeId: mongoose.Types.ObjectId; // Reference to the employee
    dueDate: Date; // Date for the to-do task
    employeeName: string;
    employeeProfilePicture: string;
    tasks: {
      title: string;
      description?: string; // Optional description
      isCompleted: boolean;
      priority: "low" | "medium" | "high"; // Task priority
      _id: mongoose.Types.ObjectId;
    }[];
    createdAt: Date;
    updatedAt: Date;
  }