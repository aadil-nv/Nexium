import mongoose, { Schema} from "mongoose";
import { IChat } from "../entities/chatEntities";

const ChatSchema: Schema = new Schema<IChat>({
  chatType: {
    type: String,
    enum: ["private", "group"]
  },
  participants: [
    {
      type:  mongoose.Schema.Types.ObjectId,
      ref: "participantModel",
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
  lastSeen: {
    type: Date,
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
