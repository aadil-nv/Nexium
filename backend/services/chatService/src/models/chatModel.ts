import mongoose, { Schema, Document } from 'mongoose';
import {IChat} from "../entities/chatEntities"


const ChatSchema: Schema = new Schema<IChat>({
    isGroupChat: { type: Boolean, default: false },
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],
    groupName: { type: String }, // Only for group chats
    messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }],
  });
  
  const Chat = mongoose.model<IChat>('Chat', ChatSchema);
  
  export default Chat;