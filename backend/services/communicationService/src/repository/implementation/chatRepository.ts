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

    async createChat(myId: string, receiverId: string): Promise<IChat> {
        try {
            const existingChat = await this._chatModel.findOne({
                chatType: "private",
                participants: { $all: [myId, receiverId] }, // Ensure both myId and receiverId are in participants
            });
    
            if (existingChat) {
               return existingChat;
            }
    
            // Create a new chat if no existing chat is found
            const createdChat = new this._chatModel({
                chatType: "private", // Set chatType to "individual"
                participants: [myId, receiverId], // Add both myId and receiverId as participants
                groupName: "", // Empty groupName for individual chats
                groupAdmin: myId, // No group admin for individual chats
            });
    
            return await createdChat.save();
        } catch (error:any) {
            console.log("Error creating chat:", error.message);
            throw error;
        }
    }
    
    
    async createMessage(chat: any): Promise<IMessage> {
        try {
            const createdMessage = new this._messageModel(chat);
            return await createdMessage.save();
            
        } catch (error) {
            console.log("Error creating message:", error);
            throw error;
            
        }
    }

    async createGroup(data: any, myId: string): Promise<IChat> {
        try {
            const groupData = {
                chatType: "group",  // Set chat type as group
                participants: [
                    myId,  // Add the creator as the first participant
                    ...data.members,  // Add the members from the request
                ],
                groupName: data.groupName,
                groupAdmin: myId,  // Set the creator as the group admin
            };
    
            const createdGroup = new this._chatModel(groupData);
            return await createdGroup.save();
        } catch (error) {
            console.log("Error creating group:", error);
            throw error;
        }
    }
    
    async findAllEmployees(): Promise<IEmployee[]> {
        try {
            const allReceiver = await this._employeeModel.find();
            return allReceiver;
            
        } catch (error) {
            console.log("Error getting all employees:", error);
            throw error;
            
        }
    }
    async findAllManagers(): Promise<IManager[]> {
        try {
            const allReceiver = await this._managerModel.find();
            return allReceiver;
            
        } catch (error) {
            console.log("Error getting all employees:", error);
            throw error;
            
        }
    }
    async findAllBusinessOwners(): Promise<IBusinessOwnerDocument[]> {
        try {
            const allReceiver = await this._businessOwnerModel.find();
            return allReceiver;
            
        } catch (error) {
            console.log("Error getting all employees:", error);
            throw error;
            
        }
    }

    async findAllGroups(myId: string): Promise<IChat[]> {
        try {
            // Search for all groups where myId is included in the participants array
            const allGroups = await this._chatModel.find({
                chatType: "group", // Ensure it is a group chat
                participants: myId, // Find groups where myId is in the participants array
            });
    
            return allGroups;
        } catch (error) {
            console.log("Error getting all groups:", error);
            throw error;
        }
    }

    async findAllPrivateChats(userId: string): Promise<IChatWithDetails[]> {
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            throw new Error('Invalid user ID provided');
        }
    
        const userObjectId = new mongoose.Types.ObjectId(userId);
    
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
                $project: {
                    _id: 1,
                    chatType: 1,
                    participants: 1,
                    lastMessage: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    lastSeen: 1,
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
            return await this._chatModel.aggregate(pipeline);
        } catch (error: any) {
            throw new Error(`Failed to fetch private chats: ${error.message}`);
        }
    }

      
      async findChatId(myId: string, receiverId: string, chatType: string): Promise<IChat> {
          try {
              // Query the Chat model to find a chat with matching participants and chatType
              const chat = await this._chatModel.findOne({
                  chatType,
                  participants: { $all: [myId, receiverId] }, // Ensure both participants are in the array
              });
      
              // If chat found, return its _id, otherwise return null
              if (!chat) {
                  throw new Error("Chat not found");
              }

              return chat

          } catch (error) {
              console.error("Error finding chat:", error);
              throw new Error("Error finding chat");
          }
      }
      
      
      
      async getChatParticipants(chatId: string): Promise<IChat | null> {
        try {
            const chat = await this._chatModel.findById(chatId).exec();
            return chat;
        } catch (error) {
            console.error("Error getting chat participants:", error);
            throw new Error("Error retrieving chat participants");
        }
    }

    async getAllGroupMembers(groupId: string): Promise<IChatWithGroupDetails> {
        if (!mongoose.Types.ObjectId.isValid(groupId)) {
            throw new Error('Invalid group ID provided');
        }
    
        const groupObjectId = new mongoose.Types.ObjectId(groupId);
    
        const pipeline = [
            {
                $match: {
                    _id: groupObjectId // Match the specific group by ID
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
            const [result] = await this._chatModel.aggregate(pipeline).exec();
    
            if (!result) {
                throw new Error("Group not found");
            }
    
            return result;
        } catch (error: any) {
            console.error("Error getting group members:", error);
            throw new Error(`Failed to fetch group members: ${error.message}`);
        }
    }

    async getGroupDetails(groupId: string): Promise<IChatWithGroupDetails> {
        if (!mongoose.Types.ObjectId.isValid(groupId)) {
            throw new Error("Invalid group ID provided");
        }
    
        const groupObjectId = new mongoose.Types.ObjectId(groupId);
    
        const pipeline = [
            {
                $match: {
                    _id: groupObjectId // Match the specific group by ID
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
            const [result] = await this._chatModel.aggregate(pipeline).exec();
            
            if (!result) {
                throw new Error("Group not found");
            }

            return result;
        } catch (error: any) {
            console.error("Error getting group members:", error);
            throw new Error(`Failed to fetch group members: ${error.message}`);
        }
    }
    
    
   async getAllUnAddedUsers(groupId: string): Promise<any> {
        try {
            const allReceiver = await this._chatModel.find({ _id: groupId }).exec();
            return allReceiver;
            
        } catch (error) {
            console.log("Error getting all employees:", error);
            throw error;
            
        }
    }

    async updateGroup(groupId: string, data: any): Promise<any> {
        try {
            const updatedGroup = await this._chatModel.findOneAndUpdate({ _id: groupId }, data, { new: true }).exec();
            return updatedGroup;
            
        } catch (error) {
            console.log("Error updating group:", error);
            throw error;
            
        }
    }

    async deleteGroup(groupId: string): Promise<any> {
        try {
            const deletedGroup = await this._chatModel.findOneAndDelete({ _id: groupId }).exec();
            return deletedGroup;
            
        } catch (error) {
            console.log("Error deleting group:", error);
            throw error;
            
        }
    }


    async updateLastSeenForChats(userId: string): Promise<any> {
        console.log(`update laste seen for ${userId}`);
        
        try {
         
    
    
            const result = await this._chatModel.updateMany(
                {
                    chatType: "private",
                    groupAdmin: { $ne: userId }, // groupAdminId !== userId
                    participants: userId // userId exists in participants
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
    
    
    
      
      
    
    