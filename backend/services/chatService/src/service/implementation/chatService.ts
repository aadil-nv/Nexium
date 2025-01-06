import { inject , injectable } from "inversify";
import  IChatService from "../interface/IChatService";
import { IChatResponseDTO, ICreateGroupDTO, IGetAllGroupsDTO, IReceiverDTO, ISetNewAccessTokenDTO } from "../../dto/chatDTO";
import  IChatRepository  from "../../repository/interface/IChatRepository";
import { generateAccessToken, verifyRefreshToken } from "../../utils/jwt";
import { log } from "util";

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
    
}