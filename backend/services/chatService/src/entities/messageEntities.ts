import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IMessage extends Document {
  
  content: string;
  sender: Types.ObjectId;
  sendersModel?: "BusinessOwner" | "Manager" | "Employee";
  chatId: Types.ObjectId;
  attachments?: {
      type: string;
      url: string;
      fileType: string;
  }[];
  readBy?: Types.ObjectId[];
  createdAt?: Date;
  updatedAt?: Date;
}
