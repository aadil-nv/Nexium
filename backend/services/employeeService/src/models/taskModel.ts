import mongoose, { Schema, Document } from "mongoose";
import { ITask } from "../entities/taskEntities";
import e, { response } from "express";

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
    taskName: {
      type: String,
    },
    assignedBy: {
      type:String,
    },
    assignedDate: {
      type: Date,
    },
    isApproved: {
      type: Boolean,
      default: false, // Tracks if the task is approved
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
        response: {
          type: String,
        },
        taskStatus: {
          type: String,
          enum: [
            "backlog",       // Task is in the backlog, not yet started.         // Task is ready to be picked up.
            "inProgress",    // Task is actively being worked on.
            "codeReview",    // Task is under code review.
            "qaTesting",     // Task is undergoing quality assurance/testing.
            "blocked",       // Task is blocked by an issue.
            "completed",     // Task is done.
            "deployed",      // Task has been deployed.     // Task is archived after deployment or completion.
            "approved",      // Task is completed and approved.
          ],
          default: "backlog",
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
