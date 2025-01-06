import mongoose, { Schema, Document, Types } from 'mongoose';


export interface IChat extends Document {
  _id: mongoose.Types.ObjectId;
  chatType: 'private' | 'group';
  participants: Types.ObjectId[];
  groupName?: string;
  groupAdmin?: Types.ObjectId;
  lastMessage?: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

  