import mongoose, { Schema, Document } from 'mongoose';
import { IMessage } from '../entities/messageEntities';


const MessageSchema: Schema = new Schema<IMessage>({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    chat: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat', required: true },
    timestamp: { type: Date, default: Date.now },
  });


const Message = mongoose.model<IMessage>('Message', MessageSchema);

export default Message;