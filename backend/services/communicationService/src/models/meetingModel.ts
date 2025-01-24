import mongoose, { Schema } from "mongoose";
import { IMeeting } from "../entities/meetingEntities";
// Define the interface for the Meeting document


// Define the Meeting schema
const MeetingSchema: Schema = new mongoose.Schema(
  {
    meetingTitle: {
      type: String,
      required: true,
      minlength: [3, "Meeting title must be at least 3 characters long"],
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
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

// Export the Meeting model
const MeetingModel = mongoose.model<IMeeting>("Meeting", MeetingSchema);

export default MeetingModel;
