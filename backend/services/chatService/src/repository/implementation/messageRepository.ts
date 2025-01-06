import { inject, injectable } from "inversify";
import IMessageRepository  from "../../repository/interface/IMessageRepository";
import {IMessage} from "../../entities/messageEntities";
import BaseRepository from "./baseRepository";
import mongoose from "mongoose";

@injectable()
export default class MessageRepository extends BaseRepository<IMessage> implements IMessageRepository {

    constructor(@inject("IMessage") private _messageModel: mongoose.Model<IMessage>) {
        super(_messageModel);
    }

    async createMessage(message: any, myId: string): Promise<IMessage> {
        try {
            const createdMessage = new this._messageModel(message);
            return await createdMessage.save();
        } catch (error) {
            console.log("Error creating message:", error);
            throw error;
        }
    }
    
}