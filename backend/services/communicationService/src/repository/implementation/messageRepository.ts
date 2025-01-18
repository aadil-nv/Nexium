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

    async createMessage(message: any): Promise<IMessage> {
        try {
            // Save the new message
            const createdMessage = await new this._messageModel(message).save();
    
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
    
            const [result] = await this._messageModel.aggregate(pipeline).exec();
    
            if (!result) {
                throw new Error("Failed to retrieve the created message details");
            }
    
            return result;
        } catch (error) {
            console.error("Error creating message:", error);
            throw new Error("Error creating message");
        }
    }

    async getAllMessages(chatRoomId: string): Promise<IMessage[]> {
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
            return await this._messageModel.aggregate(pipeline).exec();
        } catch (error: any) {
            throw new Error(`Failed to fetch messages: ${error.message}`);
        }
    }
    

    async deleteMessage(messageId: string): Promise<IMessage | null> {
        try {
            return await this._messageModel.findByIdAndDelete(messageId);
        } catch (error) {
            console.error("Error deleting message:", error);
            throw new Error("Error deleting message");
        }
    }


    
}