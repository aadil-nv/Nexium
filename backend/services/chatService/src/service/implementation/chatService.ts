import { inject , injectable } from "inversify";
import  IChatService from "../interface/IChatService";
import { IChatResponseDTO, ICreateGroupDTO, IGetAllGroupsDTO, IPrivateChatDTO, IReceiverDTO, ISetNewAccessTokenDTO } from "../../dto/chatDTO";
import  IChatRepository  from "../../repository/interface/IChatRepository";
import { generateAccessToken, verifyRefreshToken } from "../../utils/jwt";
import { log } from "util";
import IEmployee from "entities/employeeEntities";
import { IManager } from "entities/managerEntities";
import { IBusinessOwnerDocument } from "entities/businessOwnerEntities";

@injectable()

export default  class ChatService implements IChatService {
    constructor(@inject("IChatRepository") private _chatRepository: IChatRepository) {}

    
    async getAllReceiver(myId: string): Promise<IReceiverDTO[]> {
        try {
            const employees = await this._chatRepository.findAllEmployees(myId);
            const managers = await this._chatRepository.findAllManagers();
            const businessOwners = await this._chatRepository.findAllBusinessOwners();
            const lastSeen = new Date();

            const buisinessOwnereDTO: IReceiverDTO[] = businessOwners.map(businessOner => ({
                senderId: myId,
                receiverId: businessOner._id,
                receiverName: businessOner.personalDetails.businessOwnerName,
                reciverPosition: businessOner.role, 
                status: true,
                lastSeen: lastSeen,
                receiverProfilePicture: businessOner.personalDetails.profilePicture
                    ? `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${businessOner.personalDetails.profilePicture}`
                    : businessOner.personalDetails.profilePicture,
            }));

    
            // Map employee data
            const employeeDTO: IReceiverDTO[] = employees.map(employee => ({
                senderId: myId,
                receiverId: employee._id,
                receiverName: employee.personalDetails.employeeName,
                reciverPosition: employee.professionalDetails.position,
                status: employee.isActive,
                lastSeen: lastSeen,
                receiverProfilePicture: employee.personalDetails.profilePicture
                    ? `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${employee.personalDetails.profilePicture}`
                    : employee.personalDetails.profilePicture,
            }));
    
            // Map manager data
            const managerDTO: IReceiverDTO[] = managers.map(manager => ({
                senderId: myId,
                receiverId: manager._id,
                receiverName: manager.personalDetails.managerName,
                reciverPosition : manager.role,
                status: manager.isActive,
                lastSeen: lastSeen,
                receiverProfilePicture: manager.personalDetails.profilePicture
                    ? `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${manager.personalDetails.profilePicture}`
                    : manager.personalDetails.profilePicture,
            }));
    
            
            const receiverDTO = [...employeeDTO, ...managerDTO, ...buisinessOwnereDTO].filter(
                receiver => receiver.receiverId.toString() !== myId
            );

            
    
            return receiverDTO;
        } catch (error) {
            throw new Error("Error getting all receivers");
        }
    }

    async getAllGroups(myId: string): Promise<IGetAllGroupsDTO[]> {
        try {
            // Fetch all the groups from the repository
            const groups = await this._chatRepository.findAllGroups(myId);
    
            // Map the groups to the IGetAllGroupsDTO format
            const groupsDTO: IGetAllGroupsDTO[] = groups.map(group => ({
                senderId: myId,
                groupId: group._id.toString(), // Convert ObjectId to string
                groupName: group.groupName || '', // Ensure groupName is a string
                groupAdmin: group.groupAdmin ? group.groupAdmin.toString() : '', // Ensure groupAdmin is a string
                participants: group.participants.map(participant => participant.toString()), // Convert ObjectId to string
                chatType: group.chatType,
            }));
    
            return groupsDTO;
        } catch (error) {
            throw new Error("Error getting all groups");
        }
    }

    async getAllPrivateChats(myId: string): Promise<IPrivateChatDTO[]> {
        try {
            // Log the incoming user ID
            console.log("Getting private chats for user ID:", myId);
    
            // Fetch private chats from the repository and populate participants
            const privateChats = await this._chatRepository.findAllPrivateChats(myId);
    
            console.log("Raw privateChats from DB:", JSON.stringify(privateChats, null, 2));
            console.log("Number of private chats found:", privateChats?.length || 0);
    
            // Add validation to ensure privateChats exists and is an array
            if (!privateChats || !Array.isArray(privateChats)) {
                console.log("Invalid privateChats structure:", privateChats);
                throw new Error("No private chats found or invalid data structure");
            }
    
            // Log chats that pass the filter
            const validChats = privateChats.filter(chat => {
                const isValid = chat && chat.participants && Array.isArray(chat.participants);
                if (!isValid) {
                    console.log("Filtered out invalid chat:", chat);
                }
                return isValid;
            });
    
            console.log("Number of valid chats after filtering:", validChats.length);
    
            // Map privateChats to the IPrivateChatDTO structure
            const privateChatDTOs: IPrivateChatDTO[] = validChats.map(chat => {
                console.log("Processing chat:", {
                    chatId: chat._id,
                    participantsCount: chat.participants.length,
                    participantIds: chat.participants.map(p => p._id.toString())
                });
    
                // Find the receiver by excluding the current user's ID from participants
                const receiver = chat.participants.find(
                    (participant) => participant && participant._id && 
                    participant._id.toString() !== myId
                );
    
                console.log("Found receiver:", receiver ? {
                    id: receiver._id,
                    type: this.isEmployee(receiver) ? 'Employee' :
                          this.isManager(receiver) ? 'Manager' :
                          this.isBusinessOwner(receiver) ? 'BusinessOwner' : 'Unknown'
                } : 'No receiver found');
    
                if (!receiver) {
                    console.log("Chat with missing receiver:", chat);
                    throw new Error(`Receiver not found in chat participants for chat ID: ${chat._id}`);
                }
    
                // Rest of the code remains the same...
                let receiverName = "Unknown";
                if (this.isEmployee(receiver)) {
                    receiverName = receiver.personalDetails?.employeeName || "Unknown";
                } else if (this.isManager(receiver)) {
                    receiverName = receiver.personalDetails?.managerName || "Unknown";
                } else if (this.isBusinessOwner(receiver)) {
                    receiverName = receiver.personalDetails?.businessOwnerName || "Unknown";
                }
    
                let receiverPosition = "Unknown";
                if (this.isEmployee(receiver)) {
                    receiverPosition = receiver.professionalDetails?.position || "Unknown";
                } else if (this.isManager(receiver)) {
                    receiverPosition = receiver.role || "Unknown";
                } else if (this.isBusinessOwner(receiver)) {
                    receiverPosition = receiver.role || "Unknown";
                }
    
                let isActiveStatus = false;
                if (this.isEmployee(receiver)) {
                    isActiveStatus = receiver.isActive;
                } else if (this.isManager(receiver)) {
                    isActiveStatus = receiver.isActive as boolean;
                } else if (this.isBusinessOwner(receiver)) {
                    isActiveStatus = true;
                }
    
                let receiverProfilePicture: string | undefined;
                if (this.isEmployee(receiver)) {
                    receiverProfilePicture = receiver.personalDetails?.profilePicture;
                } else if (this.isManager(receiver)) {
                    receiverProfilePicture = receiver.personalDetails?.profilePicture;
                } else if (this.isBusinessOwner(receiver)) {
                    receiverProfilePicture = receiver.personalDetails?.profilePicture;
                }
    
                const dto = {
                    chatId: chat._id,
                    chatType: chat.chatType,
                    reciverId: receiver._id.toString(),
                    reciverName: receiverName,
                    reciverPosition: receiverPosition,
                    status: isActiveStatus,
                    receiverProfilePicture: receiverProfilePicture
                        ? `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${receiverProfilePicture}`
                        : undefined,
                };
    
                console.log("Created DTO:", dto);
                return dto;
            });
    
            console.log("Final privateChatDTOs:", JSON.stringify(privateChatDTOs, null, 2));
    
            return privateChatDTOs;
        } catch (error:any) {
            console.error("Error getting all private chats:", error);
            throw new Error(`Error getting all private chats: ${error.message}`);
        }
    }
    // Type guards for checking the specific types
    private isEmployee(receiver: any): receiver is IEmployee {
        return receiver && receiver.personalDetails && 'employeeName' in receiver.personalDetails;
    }
    
    private isManager(receiver: any): receiver is IManager {
        return receiver && receiver.personalDetails && 'managerName' in receiver.personalDetails;
    }
    
    private isBusinessOwner(receiver: any): receiver is IBusinessOwnerDocument {
        return receiver && receiver.personalDetails && 'businessOwnerName' in receiver.personalDetails;
    }
    
    
    
    
    
    
    
    
    
    

    async createChat(myId: string, receiverId: string): Promise<ICreateGroupDTO> {
        try {
            const createdChat = await this._chatRepository.createChat(myId, receiverId);

            console.log("Created chat:======>", createdChat);
            
    
            // Assuming createdChat contains data like groupId, groupName, etc.
            return {
                chatId: createdChat._id,        // Convert ObjectId to string
                groupName: createdChat.groupName || '',
                participants: createdChat.participants.map((participant: any) => participant.toString()), // Convert ObjectId array to string[]
                chatType: createdChat.chatType,
                groupAdmin: createdChat.groupAdmin,  // Convert ObjectId to string, handle undefined
                success: true
            };
        } catch (error: any) {
            throw new Error("Error creating chat: " + error.message);
        }
    }
    
    

    async createMessage(message: any, myId: string): Promise<IChatResponseDTO> {
        try {
            const createdMessage = await this._chatRepository.createMessage(message, myId);
            return {
                message: "Message created successfully",
                success: true
            }
            
        } catch (error) {
            throw new Error("Error creating message");
            
        }
    }

    async createGroup(data: any, myId: string): Promise<IChatResponseDTO> {
        try {
            const createdGroup = await this._chatRepository.createGroup(data, myId);
            return {
                message: "Group created successfully",
                success: true
            }
            
        } catch (error) {
            throw new Error("Error creating group");
            
        }
    }   

    async setNewAccessToken(refreshToken: string): Promise<ISetNewAccessTokenDTO> {
        try {
            const decoded = verifyRefreshToken(refreshToken);
    
            if (decoded?.employeeData) {
                const employeeData = decoded.employeeData;
                const accessToken = generateAccessToken({ employeeData });
                return {
                    accessToken,
                    message: "Access token set successfully from service",
                    success: true,
                    businessOwnerId: employeeData.businessOwnerId,
                };
            } else if (decoded?.managerData) {
                const managerData = decoded.managerData;
                const accessToken = generateAccessToken({ managerData });
                return {
                    accessToken,
                    message: "Access token set successfully from service",
                    success: true,
                };
            } else if (decoded?.businessOwnerData) {
                const businessOwnerData = decoded.businessOwnerData;
                const accessToken = generateAccessToken({ businessOwnerData });
                return {
                    accessToken,
                    message: "Access token set successfully from service",
                    success: true,
                };
            }
    
            // Fallback if none of the conditions match
            throw new Error("Invalid token data");
        } catch (error) {
            throw new Error("Error setting new access token");
        }
    }

    async findChatId(myId: string, receiverId: string, chatType: string): Promise<any> {
        console.log("findChatId called with myId:", myId, "receiverId:", receiverId, "chatType:", chatType);
        
        try {
            const chat = await this._chatRepository.findChatId(myId, receiverId, chatType);

            if (!chat) {
                throw new Error("Chat not found");


            }
            console.log(`"Chat found:==========??"`.bgRed, chat);
            
            return chat._id

            
        } catch (error) {
            throw new Error("Error finding chat");
            
        }
    }
    
}