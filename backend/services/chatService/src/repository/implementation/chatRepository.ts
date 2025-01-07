import { inject , injectable } from "inversify";
import  IChatRepository  from "../../repository/interface/IChatRepository";
import { IChat } from "../../entities/chatEntities";
import BaseRepository from "./baseRepository";
import mongoose from "mongoose";
import IEmployee from "../../entities/employeeEntities";
import { IManager } from "../../entities/managerEntities";
import { IBusinessOwnerDocument } from "../../entities/businessOwnerEntities";
import { IMessage } from "entities/messageEntities";

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
    
    async findAllEmployees(myId: string): Promise<IEmployee[]> {
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

    async findAllPrivateChats(myId: string): Promise<IChat[]> {
        try {
          const isValidId = mongoose.Types.ObjectId.isValid(myId);
          if (!isValidId) {
            console.log("Invalid myId:", myId);
            return [];
          }
      
          const allPrivateChats = await this._chatModel.aggregate([
            {
              $match: {
                chatType: "private",
                participants: { $in: [new mongoose.Types.ObjectId(myId)] }, // Correct way to query participants array
              },
            },
            // Lookup for employees
            {
              $lookup: {
                from: "employees", // Ensure the correct collection name
                localField: "participants",
                foreignField: "_id",
                as: "employeeDetails", // Alias for employee details
              },
            },
            // Lookup for managers
            {
              $lookup: {
                from: "managers", // Ensure the correct collection name
                localField: "participants",
                foreignField: "_id",
                as: "managerDetails", // Alias for manager details
              },
            },
            // Lookup for business owners
            {
              $lookup: {
                from: "businessowners", // Ensure the correct collection name
                localField: "participants",
                foreignField: "_id",
                as: "businessOwnerDetails", // Alias for business owner details
              },
            },
            {
              $unwind: {
                path: "$employeeDetails",
                preserveNullAndEmptyArrays: true, // If there's no employee, it won't cause an error
              },
            },
            {
              $unwind: {
                path: "$managerDetails",
                preserveNullAndEmptyArrays: true, // If there's no manager, it won't cause an error
              },
            },
            {
              $unwind: {
                path: "$businessOwnerDetails",
                preserveNullAndEmptyArrays: true, // If there's no business owner, it won't cause an error
              },
            },
            {
              $project: {
                chatType: 1,
                groupName: 1,
                groupAdmin: 1,
                lastMessage: 1,
                createdAt: 1,
                updatedAt: 1,
                participantDetails: {
                  $cond: {
                    if: { $ne: [{ $type: "$employeeDetails" }, "missing"] }, // If employeeDetails exists
                    then: "$employeeDetails",
                    else: {
                      $cond: {
                        if: { $ne: [{ $type: "$managerDetails" }, "missing"] }, // If managerDetails exists
                        then: "$managerDetails",
                        else: "$businessOwnerDetails", // Otherwise, fallback to businessOwnerDetails
                      },
                    },
                  },
                },
              },
            },
          ]);
      
          return allPrivateChats;
        } catch (error) {
          console.log("Error getting all private chats:", error);
          throw error;
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
      
      
      
      
      
    
    
    
    
    
    
}