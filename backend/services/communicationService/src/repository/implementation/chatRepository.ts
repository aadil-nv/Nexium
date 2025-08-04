import { inject , injectable } from "inversify";
import  IChatRepository  from "../../repository/interface/IChatRepository";
import { IChat } from "../../entities/chatEntities";
import BaseRepository from "./baseRepository";
import mongoose,{ PipelineStage } from "mongoose";
import IEmployee from "../../entities/employeeEntities";
import { IManager } from "../../entities/managerEntities";
import { IBusinessOwnerDocument } from "../../entities/businessOwnerEntities";
import { IMessage } from "entities/messageEntities";
import { IChatWithDetails, IChatWithGroupDetails } from "dto/chatDTO";
import connectDB from "../../config/connectDB";

@injectable()

export default class ChatRepository extends BaseRepository <IChat> implements IChatRepository {
    constructor(@inject("IChat") 
    private _chatModel: mongoose.Model<IChat>,
    @inject("IEmployee")
     private _employeeModel: mongoose.Model<IEmployee>,
    @inject("IManager")
    private _managerModel: mongoose.Model<IManager>,
    @inject("IBusinessOwnerDocument") 
    private _businessOwnerModel: mongoose.Model<IBusinessOwnerDocument>,
    @inject("IMessage")
    private _messageModel: mongoose.Model<IMessage>) {
        super(_chatModel);
        
    }

    async createChat(myId: string, receiverId: string, businessOwnerId: string): Promise<IChat> {
        try {
            const switchDB = await connectDB(businessOwnerId);
            const ChatModel = switchDB.model("chats", this._chatModel.schema);
    
            const existingChat = await ChatModel.findOne({
                chatType: "private",
                participants: { $all: [myId, receiverId] },
            });
    
            if (existingChat) {
                return existingChat;
            }
    
            const createdChat = new ChatModel({
                chatType: "private",
                participants: [myId, receiverId],
                groupName: "",
                groupAdmin: myId,
            });
    
            return await createdChat.save();
        } catch (error: any) {
            console.log("Error creating chat:", error.message);
            throw error;
        }
    }
    
    async createMessage(chat: any, businessOwnerId: string): Promise<IMessage> {
        try {
            const switchDB = await connectDB(businessOwnerId);
            const MessageModel = switchDB.model("messages", this._messageModel.schema); 
            const createdMessage = new MessageModel(chat);
            
            return await createdMessage.save();
        } catch (error) {
            console.log("Error creating message:", error);
            throw error;
        }
    }
    

    async createGroup(data: any, myId: string, businessOwnerId: string): Promise<IChat> {
        try {
            const groupData = {
                chatType: "group", 
                participants: [
                    myId, 
                    ...data.members, 
                ],
                groupName: data.groupName,
                groupAdmin: myId,  
            };
    
            const switchDB = await connectDB(businessOwnerId);
            const ChatModel = switchDB.model("chats", this._chatModel.schema);
            const createdGroup = new ChatModel(groupData);
    
            return await createdGroup.save();
        } catch (error) {
            console.log("Error creating group:", error);
            throw error;
        }
    }
    
    
    async findAllEmployees(businessOwnerId : string): Promise<IEmployee[]> {
        try {
            const switchDB = await connectDB(businessOwnerId);
            const allReceiver = await switchDB.model("employees" , this._employeeModel.schema).find();
            return allReceiver;
            
        } catch (error) {
            console.log("Error getting all employees:", error);
            throw error;
            
        }
    }
    async findAllManagers(businessOwnerId : string): Promise<IManager[]> {
        try {
            const switchDB = await connectDB(businessOwnerId);
            const allReceiver = await switchDB.model("managers" , this._managerModel.schema).find();
            return allReceiver;
            
        } catch (error) {
            console.log("Error getting all employees:", error);
            throw error;
            
        }
    }
    async findAllBusinessOwners(businessOwnerId : string): Promise<IBusinessOwnerDocument[]> {
        try {
            const switchDB = await connectDB(businessOwnerId);
            const allReceiver = await switchDB.model("businessOwners" , this._businessOwnerModel.schema).find();
            return allReceiver;
            
        } catch (error) {
            console.log("Error getting all employees:", error);
            throw error;
            
        }
    }

    async findAllGroups(myId: string ,businessOwnerId: string): Promise<IChat[]> {
        try {
            const switchDB = await connectDB(businessOwnerId);
            const allGroups = await switchDB.model("chats" , this._chatModel.schema).find({
                chatType: "group", 
                participants: myId,
            });
    
            return allGroups;
        } catch (error) {
            console.log("Error getting all groups:", error);
            throw error;
        }
    }

    async findAllPrivateChats(userId: string ,businessOwnerId: string): Promise<IChatWithDetails[]> {
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            throw new Error('Invalid user ID provided');
        }
    
        const userObjectId = new mongoose.Types.ObjectId(userId);
    
        const switchDB = await connectDB(businessOwnerId);
    
        const pipeline: PipelineStage[] = [
            {
                $match: {
                    chatType: "private",
                    participants: { $elemMatch: { $eq: new mongoose.Types.ObjectId(userObjectId) } }
                }
            },
            {
                $addFields: {
                    otherParticipant: {
                        $arrayElemAt: [
                            {
                                $filter: {
                                    input: "$participants",
                                    as: "participant",
                                    cond: { $ne: ["$$participant", new mongoose.Types.ObjectId(userObjectId)] }
                                }
                            },
                            0
                        ]
                    }
                }
            },
            {
                $lookup: {
                    from: "employees",
                    localField: "otherParticipant",
                    foreignField: "_id",
                    as: "employeeDetails"
                }
            },
            {
                $lookup: {
                    from: "managers",
                    localField: "otherParticipant",
                    foreignField: "_id",
                    as: "managerDetails"
                }
            },
            {
                $lookup: {
                    from: "businessowners",
                    localField: "otherParticipant",
                    foreignField: "_id",
                    as: "businessOwnerDetails"
                }
            },
            {
                $lookup: {
                    from: "messages",
                    localField: "lastMessage",
                    foreignField: "_id",
                    as: "lastMessageDetails",
                },
            },
            {
                $project: {
                    _id: 1,
                    chatType: 1,
                    participants: 1,
                    lastMessage: { $arrayElemAt: ["$lastMessageDetails", 0] },
                    createdAt: 1,
                    updatedAt: 1,
                    lastSeen: 1,
                    lastMessageTime: 1,
                    participantDetails: {
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
            },
            {
                $sort: { updatedAt: -1 as 1 | -1 } // Explicitly cast to `1 | -1`
            }
        ];
    
        try {

            return  await switchDB.model("chats", this._chatModel.schema).aggregate(pipeline);
        } catch (error: any) {
            throw new Error(`Failed to fetch private chats: ${error.message}`);
        }
    }

      
      async findChatId(myId: string, receiverId: string, chatType: string ,businessOwnerId: string): Promise<IChat> {
          try {
            const switchDB = await connectDB(businessOwnerId);
              const chat = await switchDB.model("chats", this._chatModel.schema).findOne({
                  chatType,
                  participants: { $all: [myId, receiverId] }, 
              });
      

              if (!chat) {
                  throw new Error("Chat not found");
              }

              return chat

          } catch (error) {
              console.error("Error finding chat:", error);
              throw new Error("Error finding chat");
          }
      }
      
      
      
      async getChatParticipants(chatId: string ,businessOwnerId: string): Promise<IChat | null> {
        try {
            const switchDB = await connectDB(businessOwnerId);
            const chat = await switchDB.model("chats", this._chatModel.schema).findById(chatId).exec();
            return chat;
        } catch (error) {
            console.error("Error getting chat participants:", error);
            throw new Error("Error retrieving chat participants");
        }
    }

    async getAllGroupMembers(groupId: string , businessOwnerId: string): Promise<IChatWithGroupDetails> {
        if (!mongoose.Types.ObjectId.isValid(groupId)) {
            throw new Error('Invalid group ID provided');
        }
    
        const groupObjectId = new mongoose.Types.ObjectId(groupId);
    
        const pipeline = [
            {
                $match: {
                    _id: groupObjectId 
                }
            },
            {
                $lookup: {
                    from: "employees",
                    localField: "participants",
                    foreignField: "_id",
                    as: "employeeDetails"
                }
            },
            {
                $lookup: {
                    from: "managers",
                    localField: "participants",
                    foreignField: "_id",
                    as: "managerDetails"
                }
            },
            {
                $lookup: {
                    from: "businessowners",
                    localField: "participants",
                    foreignField: "_id",
                    as: "businessOwnerDetails"
                }
            },
            {
                $project: {
                    _id: 1,
                    chatType: 1,
                    participants: 1,
                    lastMessage: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    groupMemberDetails: {
                        employees: "$employeeDetails",
                        managers: "$managerDetails",
                        businessOwners: "$businessOwnerDetails"
                    }
                }
            }
        ];
    
        try {
            const switchDB = await connectDB(businessOwnerId);
            const [result] = await switchDB.model("chats", this._chatModel.schema).aggregate(pipeline).exec();
    
            if (!result) {
                throw new Error("Group not found");
            }
    
            return result;
        } catch (error: any) {
            console.error("Error getting group members:", error);
            throw new Error(`Failed to fetch group members: ${error.message}`);
        }
    }

    async getGroupDetails(groupId: string , businessOwnerId: string): Promise<IChatWithGroupDetails> {
        if (!mongoose.Types.ObjectId.isValid(groupId)) {
            throw new Error("Invalid group ID provided");
        }
    
        const groupObjectId = new mongoose.Types.ObjectId(groupId);
    
        const pipeline = [
            {
                $match: {
                    _id: groupObjectId 
                }
            },
            {
                $lookup: {
                    from: "employees",
                    localField: "participants",
                    foreignField: "_id",
                    as: "employeeDetails"
                }
            },
            {
                $lookup: {
                    from: "managers",
                    localField: "participants",
                    foreignField: "_id",
                    as: "managerDetails"
                }
            },
            {
                $lookup: {
                    from: "businessowners",
                    localField: "participants",
                    foreignField: "_id",
                    as: "businessOwnerDetails"
                }
            },
            {
                $project: {
                    _id: 1,
                    chatType: 1,
                    groupName: 1,
                    participants: 1,
                    groupAdmin: 1,
                    lastMessage: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    groupMemberDetails: {
                        employees: {
                            $map: {
                                input: "$employeeDetails",
                                as: "employee",
                                in: {
                                    _id: "$$employee._id",
                                    name: "$$employee.personalDetails.employeeName",
                                    profilePicture: "$$employee.personalDetails.profilePicture",
                                    role: "$$employee.role",
                                    position: "$$employee.professionalDetails.position",
                                    isActive: "$$employee.isActive"
                                }
                            }
                        },
                        managers: {
                            $map: {
                                input: "$managerDetails",
                                as: "manager",
                                in: {
                                    _id: "$$manager._id",
                                    name: "$$manager.personalDetails.managerName",
                                    profilePicture: "$$manager.personalDetails.profilePicture",
                                    role: "$$manager.role",
                                    position: "$$manager.professionalDetails.designation",
                                    isActive: "$$manager.isActive"
                                }
                            }
                        },
                        businessOwners: {
                            $map: {
                                input: "$businessOwnerDetails",
                                as: "businessOwner",
                                in: {
                                    _id: "$$businessOwner._id",
                                    name: "$$businessOwner.personalDetails.businessOwnerName",
                                    profilePicture: "$$businessOwner.personalDetails.profilePicture",
                                    role: "$$businessOwner.role",
                                    isActive: "$$businessOwner.isActive"
                                }
                            }
                        }
                    }
                }
            }
            
        ];
    
        try {
            const switchDB = await connectDB(businessOwnerId);
            const [result] = await switchDB.model("chats", this._chatModel.schema).aggregate(pipeline).exec();
            
            if (!result) {
                throw new Error("Group not found");
            }

            return result;
        } catch (error: any) {
            console.error("Error getting group members:", error);
            throw new Error(`Failed to fetch group members: ${error.message}`);
        }
    }
    
    
   async getAllUnAddedUsers(groupId: string , businessOwnerId: string): Promise<any> {
        try {
            const switchDB = await connectDB(businessOwnerId);
            const allReceiver = await switchDB.model("chats", this._chatModel.schema).find({ _id: groupId }).exec();
            return allReceiver;
            
        } catch (error) {
            console.log("Error getting all employees:", error);
            throw error;
            
        }
    }

    async updateGroup(groupId: string, data: any ,businessOwnerId: string): Promise<any> {
        try {
            const switchDB =await connectDB(businessOwnerId);
            const updatedGroup = await switchDB.model("chats", this._chatModel.schema).findOneAndUpdate({ _id: groupId }, data, { new: true }).exec();
            return updatedGroup;
            
        } catch (error) {
            console.log("Error updating group:", error);
            throw error;
            
        }
    }

    async deleteGroup(groupId: string ,businessOwnerId: string): Promise<any> {
        try {
            const switchDB = await connectDB(businessOwnerId);
            const deletedGroup = await switchDB.model("chats", this._chatModel.schema).findOneAndDelete({ _id: groupId }).exec();
            return deletedGroup;
            
        } catch (error) {
            console.log("Error deleting group:", error);
            throw error;
            
        }
    }


    async updateLastSeenForChats(userId: string ,businessOwnerId: string): Promise<any> { 
        try {
         
            const switchDB = await connectDB(businessOwnerId);
            const result = await switchDB.model("chats", this._chatModel.schema).updateMany(
                {
                    chatType: "private",
                    groupAdmin: { $ne: userId }, 
                    participants: userId 
                },
                {
                    $set: { lastSeen: new Date() }
                }
            );
    
            return {
                success: true,
                message: "Last seen updated successfully!",
                data: result
            };
        } catch (error: any) {
            throw new Error(error.message || "Error while updating last seen");
        }
    }


    
}
    
    
    
      
      
    
    