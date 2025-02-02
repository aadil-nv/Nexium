import mongoose, { Schema, Document, Types } from 'mongoose';



export interface IChat extends Document {
  _id: mongoose.Types.ObjectId;
  chatType: "private" | "group";
  participants: mongoose.Types.ObjectId[]; // Array of participant ObjectIds
  participantModel?: "BusinessOwner" | "Manager" | "Employee";
  groupName?: string; // Optional for private chats
  groupAdmin?: mongoose.Types.ObjectId; // Optional for private chats
  lastMessage?: mongoose.Types.ObjectId; // Optional
  createdAt?: Date; // Optional, as it is auto-assigned
  updatedAt?: Date; // Optional, as it is auto-assigned
  lastSeen?: Date
}



  