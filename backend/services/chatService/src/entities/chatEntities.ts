import mongoose, { Schema, Document } from 'mongoose';


export interface IChat extends Document {
    isGroupChat: boolean; // To distinguish between individual and group chat
    participants: mongoose.Schema.Types.ObjectId[]; // Array of user IDs (for both individual and group chats)
    groupName?: string; // Optional, for group chats
    messages: mongoose.Schema.Types.ObjectId[]; // Messages related to the chat
  }
  