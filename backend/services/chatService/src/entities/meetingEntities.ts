import mongoose, { Schema, Document } from "mongoose";


export interface IMeeting extends Document {
    meetingTitle: string; // Title of the meeting
    meetingDate: Date; // Date of the meeting
    meetingTime: string; // Time of the meeting
    startingTime: string; // Start time of the meeting
    endingTime: string; // End time of the meeting
    participants: mongoose.Types.ObjectId[]; // Array of participant IDs
    meetingLink: string; // Link for the meeting
    scheduledBy: mongoose.Types.ObjectId; // ID of the user who scheduled the meeting
  }