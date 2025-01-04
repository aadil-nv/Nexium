import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage extends Document {
  sender: mongoose.Schema.Types.ObjectId; // User who sent the message
  content: string; // Message content
  chat: mongoose.Schema.Types.ObjectId; // Chat this message belongs to
  timestamp: Date; // When the message was sent
}

