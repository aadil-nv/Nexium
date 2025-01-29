import mongoose, { Schema, Document } from "mongoose";
import {ITask} from "../entities/taskEntities";
import e from "express";


const TaskSchema = new Schema<ITask>(
  {
    employeeId: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
    },
    dueDate: {
      type: Date,
    },
    employeeName: {
      type: String,
    },
    employeeProfilePicture: {
      type: String,
    },
    tasks: [
      {
        title: {
          type: String,
        },
        description: {
          type: String,
        },
        isCompleted: {
          type: Boolean,
          default: false,
        },
        priority: {
          type: String,
          enum: ["low", "medium", "high"],
          default: "low",
        },
      
      },
    ],
  },
  {
    timestamps: true, // Automatically adds `createdAt` and `updatedAt` fields
  }
);

// Create and export the Task model
const Task = mongoose.model<ITask>("Task", TaskSchema);
export default Task;
