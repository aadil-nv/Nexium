import { inject, injectable } from "inversify";
import IMessageRepository from "../../repository/interface/IMessageRepository";
import IMessageService from "../interface/IMessageService";
import { IMessageDTO, IMessageResponse } from "../../dto/messageDTO";
import { IMessage } from "../../entities/messageEntities";
import { IParticipantDetails } from "dto/chatDTO";

@injectable()

export default class MessageService implements IMessageService {
    constructor(@inject("IMessageRepository") private _messageRepository: IMessageRepository) { }
    async createMessage(senderId: string,chatId: string,message: any): Promise<IMessageDTO> {
        try {
            // Prepare message data
            const messageData = {
                content: message,
                sender: senderId,
                chatId,
                attachments: message.attachments || [],
                readBy: [],
            };
    
            // Create the message using the repository
            const createdMessage:any = await this._messageRepository.createMessage(messageData);
    
            // Map the created message to the DTO format
            const response: IMessageDTO = {
                messageId: createdMessage._id.toString(),
                text: createdMessage.content,
                senderId: createdMessage.sender.toString(),
                chatId: createdMessage.chatId.toString(),
                attachments: JSON.stringify(createdMessage.attachments || []),
                readBy: createdMessage.readBy.join(",") || "read", // Example handling of `readBy`
                createdAt: createdMessage.createdAt?.toISOString() || "",
                senderName: this.getSenderName(createdMessage.senderDetails),
                senderPicture: this.getSenderPicture(createdMessage.senderDetails),
            };
    
            return response;
        } catch (error) {
            console.error("Error creating message:", error);
            throw new Error("Error creating message");
        }
    }
    
    async getAllMessages(chatRoomId: string, myId: string): Promise<IMessageDTO[]> {
        try {
            const messages: IMessage[] = await this._messageRepository.getAllMessages(chatRoomId);

            const response: IMessageDTO[] = messages.map((message: any) => ({
                messageId: message._id.toString(),
                text: message.content,
                senderId: message.sender.toString(),
                chatId: message.chatId.toString(),
                attachments: JSON.stringify(message.attachments || []),
                readBy: "read",
                createdAt: message.createdAt?.toISOString() || "",
                reciverId: message.sender.toString() === myId 
                            ? message.chatId.toString() 
                            : myId, // Fix for receiver ID logic
                status: "delivered",
                senderName: this.getSenderName(message.senderDetails),
                senderPicture: this.getSenderPicture(message.senderDetails),
            }));
    
            return response;
        } catch (error) {
            console.error("Error getting messages service:", error);
            throw new Error("Error getting messages service");
        }
    }
    
    private getSenderName(senderDetails: any): string {
        if (!senderDetails) return "Unknown";
        return (
            senderDetails.personalDetails.businessOwnerName ||
            senderDetails.personalDetails.employeeName ||
            senderDetails.personalDetails.managerName ||
            "Unknown"
        );
    }
    
    private getSenderPicture(senderDetails: any): string {
        if (!senderDetails) return "";
        return senderDetails.personalDetails.profilePicture ?
         `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${senderDetails.personalDetails.profilePicture}` 
         : senderDetails.personalDetails.profilePicture;
    }
    
    async deleteMessage(messageId: string): Promise<IMessageResponse> {
        try {
            // Ensure the delete operation is awaited
            const message = await this._messageRepository.deleteMessage(messageId);
    
            if (!message) {
                return {
                    success: false,
                    message: "Message not found",
                };
            }
    
            return {
                success: true,
                message: "Message deleted successfully",
            };
        } catch (error) {
            console.error("Error deleting message:", error);
            throw new Error("Error deleting message");
        }
    }
    
}