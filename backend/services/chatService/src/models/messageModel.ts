import mongoose, { Schema, Document } from "mongoose";
import { IMessage } from "../entities/messageEntities";

const MessageSchema: Schema = new Schema<IMessage>({
  content: {
    type: String,
    required: true,
    trim: true,
  },
  sender: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  chatId: {
    type: Schema.Types.ObjectId,
    ref: "Chat",
    required: true,
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
      ref: "User",
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
