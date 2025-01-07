import mongoose, { Schema, Document } from "mongoose";
import { IChat } from "../entities/chatEntities";

const ChatSchema: Schema = new Schema<IChat>({
  chatType: {
    type: String,
    enum: ["private", "group"],
    required: true,
  },
  participants: [
    {
      type:  mongoose.Schema.Types.ObjectId,
      ref: "participantModel",
      required: true,
    },
  ],
  participantModel: {
    type: String,
    enum: ['BusinessOwner', 'Manager', 'Employee'],
  },
  groupName: {
    type: String,
    trim: true,
  },
  groupAdmin: {
    type:  mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  lastMessage: {
    type:  mongoose.Schema.Types.ObjectId,
    ref: "Message",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Chat = mongoose.model<IChat>("Chat", ChatSchema);

export default Chat;
