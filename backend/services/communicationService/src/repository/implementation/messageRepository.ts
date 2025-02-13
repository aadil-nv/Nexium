import { inject, injectable } from "inversify";
import IMessageRepository  from "../../repository/interface/IMessageRepository";
import {IMessage} from "../../entities/messageEntities";
import BaseRepository from "./baseRepository";
import mongoose from "mongoose";
import connectDB from "../../config/connectDB";
import chatModel from "../../models/chatModel";

@injectable()
export default class MessageRepository extends BaseRepository<IMessage> implements IMessageRepository {

    constructor(@inject("IMessage") private _messageModel: mongoose.Model<IMessage>) {
        super(_messageModel);
    }

    async createMessage(messageData: any, businessOwnerId: string): Promise<IMessage> {
     
        try {
            const switchDB = await connectDB(businessOwnerId);
            const MessageModel = switchDB.model("messages", this._messageModel.schema);
            const ChatModel = switchDB.model("chats", chatModel.schema);
            
            const createdMessage = await new MessageModel(messageData).save();

            await ChatModel.updateOne(
                { _id: messageData.chatId },
                {
                    $set: { 
                        lastMessage: createdMessage._id, 
                        lastMessageTime: createdMessage.createdAt 
                    }
                }
            );
    
            // Use an aggregation pipeline to fetch the complete message details
            const pipeline = [
                {
                    $match: {
                        _id: createdMessage._id // Match the newly created message by ID
                    }
                },
                {
                    $lookup: {
                        from: "businessowners",
                        localField: "sender",
                        foreignField: "_id",
                        as: "businessOwnerDetails"
                    }
                },
                {
                    $lookup: {
                        from: "employees",
                        localField: "sender",
                        foreignField: "_id",
                        as: "employeeDetails"
                    }
                },
                {
                    $lookup: {
                        from: "managers",
                        localField: "sender",
                        foreignField: "_id",
                        as: "managerDetails"
                    }
                },
                {
                    $project: {
                        _id: 1,
                        content: 1,
                        sender: 1,
                        sendersModel: 1,
                        chatId: 1,
                        attachments: 1,
                        readBy: 1,
                        createdAt: 1,
                        updatedAt: 1,
                        senderDetails: {
                            $cond: {
                                if: { $gt: [{ $size: "$employeeDetails" }, 0] },
                                then: { $arrayElemAt: ["$employeeDetails", 0] },
                                else: {
                                    $cond: {
                                        if: { $gt: [{ $size: "$managerDetails" }, 0] },
                                        then: { $arrayElemAt: ["$managerDetails", 0] },
                                        else: { $arrayElemAt: ["$businessOwnerDetails", 0] }
                                    }
                                }
                            }
                        }
                    }
                }
            ];
    
            const [result] = await MessageModel.aggregate(pipeline).exec();
    
            if (!result) {
                throw new Error("Failed to retrieve the created message details");
            }
    
            return result;
        } catch (error) {
            console.error("Error creating message:", error);
            throw new Error("Error creating message");
        }
    }
    

    async getAllMessages(chatRoomId: string , businessOwnerId: string): Promise<IMessage[]> {
        if (!mongoose.Types.ObjectId.isValid(chatRoomId)) {
            throw new Error("Invalid chatRoomId provided");
        }
    
        const chatRoomObjectId = new mongoose.Types.ObjectId(chatRoomId);
    
        const pipeline = [
            {
                $match: {
                    chatId: chatRoomObjectId
                }
            },
            {
                $lookup: {
                    from: "businessowners",
                    localField: "sender",
                    foreignField: "_id",
                    as: "businessOwnerDetails"
                }
            },
            {
                $lookup: {
                    from: "employees",
                    localField: "sender",
                    foreignField: "_id",
                    as: "employeeDetails"
                }
            },
            {
                $lookup: {
                    from: "managers",
                    localField: "sender",
                    foreignField: "_id",
                    as: "managerDetails"
                }
            },
            {
                $project: {
                    _id: 1,
                    content: 1,
                    sender: 1,
                    sendersModel: 1,
                    chatId: 1,
                    attachments: 1,
                    readBy: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    senderDetails: {
                        $cond: {
                            if: { $gt: [{ $size: "$employeeDetails" }, 0] },
                            then: { $arrayElemAt: ["$employeeDetails", 0] },
                            else: {
                                $cond: {
                                    if: { $gt: [{ $size: "$managerDetails" }, 0] },
                                    then: { $arrayElemAt: ["$managerDetails", 0] },
                                    else: { $arrayElemAt: ["$businessOwnerDetails", 0] }
                                }
                            }
                        }
                    }
                }
            }
        ];
    
        try {
            const switchDB = await connectDB(businessOwnerId);
            return await switchDB.model("messages", this._messageModel.schema).aggregate(pipeline).exec();
        } catch (error: any) {
            throw new Error(`Failed to fetch messages: ${error.message}`);
        }
    }
    

    async deleteMessage(messageId: string,businessOwnerId: string): Promise<IMessage | null> {
        try {
            const switchDB = await connectDB(businessOwnerId);
            return await switchDB.model("messages", this._messageModel.schema).findByIdAndDelete(messageId);
        } catch (error) {
            console.error("Error deleting message:", error);
            throw new Error("Error deleting message"); 
        }
    }


    
}