import mongoose, { Schema } from "mongoose";
import { IMeeting } from "../entities/meetingEntities";
// Define the interface for the Meeting document


// Define the Meeting schema
const MeetingSchema: Schema = new mongoose.Schema(
  {
    meetingTitle: {
      type: String,
      required: true,
    },
    meetingDate: {
      type: Date,
      required: true,
    },
    meetingTime: {
      type: String,
      required: true,
    },
    participants: {
      type: [mongoose.Schema.Types.ObjectId],
      required: true,
      ref: "User", // Reference to User model
    },
    meetingLink: {
      type: String,
      required: true,
    },
    scheduledBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User", // Reference to User model
    },
    isRecurring: {
      type: Boolean,
      default: false,
    },
    recurringType: {
      type: String,
      enum: ["daily", "weekly"],
      default: "daily",
    },
    recurringDay: {
      type: String,
      enum: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"],
      default: "monday",
    }
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

// Export the Meeting model
const MeetingModel = mongoose.model<IMeeting>("Meeting", MeetingSchema);

export default MeetingModel;
