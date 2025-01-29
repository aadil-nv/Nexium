import mongoose, { Schema, Document } from "mongoose";
import { IMessage } from "../entities/messageEntities";

const MessageSchema: Schema = new Schema<IMessage>({
  content: {
    type: String,
    trim: true,
  },
  sender: {
    type: Schema.Types.ObjectId,
    ref: "sendersModel"
  
  },
  sendersModel: {
    type: String,
    enum: ['BusinessOwner', 'Manager', 'Employee'],
  },
  chatId: {
    type: Schema.Types.ObjectId,
    ref: "Chat"
  },
  attachments: [
    {
      type: {
        type: String,
      },
      url: String,
      fileType: String,
    },
  ],
  readBy: [
    {
      type: Schema.Types.ObjectId,
       ref: "sendersModel"
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Message = mongoose.model<IMessage>("Message", MessageSchema);

export default Message;
