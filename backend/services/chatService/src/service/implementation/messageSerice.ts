import { inject, injectable } from "inversify";
import IMessageRepository from "../../repository/interface/IMessageRepository";
import IMessageService from "../interface/IMessageService";
import { IMessageDTO } from "../../dto/messageDTO";

@injectable()

export default class MessageService implements IMessageService {
    constructor(@inject("IMessageRepository") private _messageRepository: IMessageRepository) { }
    async createMessage(message: any, myId: string): Promise<IMessageDTO> {
        try {
            const createdMessage = await this._messageRepository.createMessage(message, myId);
            return {
               
                success: true
            }
            
        } catch (error) {
            throw new Error("Error creating message");
            
        }
    }
    }