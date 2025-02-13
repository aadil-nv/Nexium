import { inject , injectable } from "inversify";
import  IChatService from "../interface/IChatService";
import { IChatResponseDTO, IChatWithDetails, ICreateGroupDTO, IGetAllGroupsDTO,
     IGroupDTO, IMembers, IMembersDTO, IParticipantDetails, IPrivateChatDTO, IReceiverDTO, ISetNewAccessTokenDTO ,IParticipant, 
     IUnAddedUsersDTO,
     IResponseDTO,
     ILastMessage} from "../../dto/chatDTO";
import  IChatRepository  from "../../repository/interface/IChatRepository";
import { generateAccessToken, verifyRefreshToken } from "../../utils/jwt";





@injectable()

export default  class ChatService implements IChatService {
    constructor(@inject("IChatRepository") private _chatRepository: IChatRepository) {}

    
    async getAllReceiver(myId: string , businessOwnerId: string): Promise<IReceiverDTO[]> {
        try {
            const employees = await this._chatRepository.findAllEmployees(businessOwnerId);
            const managers = await this._chatRepository.findAllManagers(businessOwnerId);
            const businessOwners = await this._chatRepository.findAllBusinessOwners(businessOwnerId);
            const lastSeen = new Date();

            const buisinessOwnereDTO: IReceiverDTO[] = businessOwners.map(businessOner => ({
                senderId: myId,
                receiverId: businessOner._id,
                receiverName: businessOner.personalDetails.businessOwnerName,
                receiverPosition: businessOner.role, 
                status: businessOner.isActive,
                lastSeen: lastSeen,
                businesOwnerId: businessOner._id,
                receiverProfilePicture: businessOner.personalDetails.profilePicture
                    ? `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${businessOner.personalDetails.profilePicture}`
                    : businessOner.personalDetails.profilePicture,
            }));

    
            // Map employee data
            const employeeDTO: IReceiverDTO[] = employees.map(employee => ({
                senderId: myId,
                receiverId: employee._id,
                receiverName: employee.personalDetails.employeeName,
                receiverPosition: employee.professionalDetails.position,
                status: employee.isActive,
                lastSeen: lastSeen,
                businesOwnerId: employee.businessOwnerId,
                receiverProfilePicture: employee.personalDetails.profilePicture
                    ? `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${employee.personalDetails.profilePicture}`
                    : employee.personalDetails.profilePicture,
            }));
    
            // Map manager data
            const managerDTO: IReceiverDTO[] = managers.map(manager => ({
                senderId: myId,
                receiverId: manager._id,
                receiverName: manager.personalDetails.managerName,
                receiverPosition : manager.role,
                status: manager.isActive,
                lastSeen: lastSeen,
                businesOwnerId: manager.businessOwnerId,
                receiverProfilePicture: manager.personalDetails.profilePicture
                    ? `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${manager.personalDetails.profilePicture}`
                    : manager.personalDetails.profilePicture,
            }));
    
            
            const receiverDTO = [...employeeDTO, ...managerDTO, ...buisinessOwnereDTO].filter(
                receiver => receiver.receiverId.toString() !== myId
            );
    
            return receiverDTO;
        } catch (error) {
            console.log(error);
            
            throw new Error("Error getting all receivers");
        }
    }

    async getAllGroups(myId: string ,businessOwnerId: string): Promise<IGetAllGroupsDTO[]> {
        try {
            // Fetch all the groups from the repository
            const groups = await this._chatRepository.findAllGroups(myId ,businessOwnerId);
    
            // Map the groups to the IGetAllGroupsDTO format
            const groupsDTO: IGetAllGroupsDTO[] = groups.map(group => ({
                senderId: myId,
                groupId: group._id.toString(), // Convert ObjectId to string
                groupName: group.groupName || '', // Ensure groupName is a string
                groupAdmin: group.groupAdmin ? group.groupAdmin.toString() : '', // Ensure groupAdmin is a string
                participants: group.participants.map(participant => participant.toString()), // Convert ObjectId to string
                chatType: group.chatType,
                busineesOwnerId :businessOwnerId
            }));
    
            return groupsDTO;
        } catch (error) {
            throw new Error("Error getting all groups");
        }
    }

    async getAllPrivateChats(myId: string ,businessOwnerId: string): Promise<IPrivateChatDTO[]> {
        try {
            const privateChats = await this._chatRepository.findAllPrivateChats(myId ,businessOwnerId);            
            
            const mappedChats: IPrivateChatDTO[] = privateChats
                .map(chat => {
                    try {
                        const typedChat = chat as IChatWithDetails;
                        const receiver = this.findReceiver(typedChat.participantDetails, myId);

                        
    
                        if (!receiver) {
                            console.warn(`Skipping chat ${chat._id} - receiver not found`);
                            return null; 
                        }
    
                        return this.mapToDTO(typedChat, receiver , myId);
                    } catch (error:any) {
                        console.error(`Error mapping chat ${chat._id}: ${error.message}`);
                        return null; 
                    }
                })
                .filter((chat): chat is IPrivateChatDTO => chat !== null); 

                console.log("mappedChats are ===>",mappedChats);
                
            return mappedChats;
        } catch (error:any) {
            console.error("Error in getAllPrivateChats: ", error.message);
            throw new Error(`Failed to get private chats: ${error.message}`);
        }
    }
    
    private findReceiver(participant: IParticipantDetails, currentmyId: string): IParticipantDetails | null {
        return participant._id.toString() !== currentmyId ? participant : null;
    }

    private mapToDTO(chat: IChatWithDetails, receiver: IParticipantDetails , myId: string): IPrivateChatDTO {
            // console.log("participants are ===>",receiver);
            
        const receiverName = this.getReceiverName(receiver);
        const receiverPosition = this.getReceiverPosition(receiver);
        const status = this.getReceiverStatus(receiver);
        const profilePicture = receiver.personalDetails?.profilePicture;
        const lastMessage = (chat.lastMessage as ILastMessage | null)?.content || undefined;

        return {
            senderId:myId,
            chatId: chat._id.toString(),
            chatType: chat.chatType,
            receiverId: receiver._id.toString(),
            receiverName,
            receiverPosition,
            status,
            receiverProfilePicture: profilePicture 
                ? `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${profilePicture}`
                : undefined,
            lastMessage: lastMessage,
            createdAt: chat.createdAt,
            updatedAt: chat.updatedAt,
            lastSeen: chat.lastSeen,
            lastMessageTime: chat.lastMessageTime,
            businessOwnerId: receiver.businessOwnerId || receiver._id.toString(),
        };
    }

    private getReceiverName(receiver: IParticipantDetails): string {
        const details = receiver.personalDetails;
        return details?.employeeName ||
            details?.managerName ||
            details?.businessOwnerName ||
            'Unknown';
    }

    private getReceiverPosition(receiver: IParticipantDetails): string {
        return receiver.professionalDetails?.position ||
            receiver.role ||
            'Unknown';
    }

    private getReceiverStatus(receiver: IParticipantDetails): boolean {
        if ('isActive' in receiver) {
            return !!receiver.isActive;
        }
        return true; 
    }

    async createChat(myId: string, receiverId: string , businessOwnerId: string): Promise<ICreateGroupDTO> {
        try {
            const createdChat = await this._chatRepository.createChat(myId, receiverId , businessOwnerId);
        
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
    
    async createMessage(message: any, myId: string ,businessOwnerId: string): Promise<IChatResponseDTO> {
        try {
            const createdMessage = await this._chatRepository.createMessage(message, myId , businessOwnerId);
            return {
                message: "Message created successfully",
                success: true
            }
            
        } catch (error) {
            throw new Error("Error creating message");
            
        }
    }

    async createGroup(data: any, myId: string ,businessOwnerId: string): Promise<IChatResponseDTO> {
        try {
            const createdGroup = await this._chatRepository.createGroup(data, myId , businessOwnerId);
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

    async findChatId(myId: string, receiverId: string, chatType: string ,businessOwnerId: string): Promise<any> {        
        try {
            const chat = await this._chatRepository.findChatId(myId, receiverId, chatType , businessOwnerId);

            if (!chat) {
                throw new Error("Chat not found");

            }           
            return chat._id
        } catch (error) {
            throw new Error("Error finding chat");
            
        }
    }

    async getChatParticipants(chatId: string , businessOwnerId: string): Promise<any> {
    
        try {
            const chat = await this._chatRepository.getChatParticipants(chatId, businessOwnerId);
    
            if (!chat) {
                throw new Error("Chat not found");
            }
    
    
            // You can return just the participants or the entire chat object
            return chat.participants;
        } catch (error) {
            console.error("Error in service layer:", error);
            throw new Error("Error retrieving chat participants");
        }
    }

    async getAllGroupMembers(groupId: string , businessOwnerId: string): Promise<IMembersDTO[]> {
        try {
            const groupDetails = await this._chatRepository.getAllGroupMembers(groupId , businessOwnerId);
    
            const participants = groupDetails.participants;
    
            const membersDTO: IMembersDTO[] = [];
    
            for (const participantId of participants) {
                let member: any = null;
    
                member = groupDetails.groupMemberDetails.employees.find((emp: any) => emp._id.toString() === participantId.toString());
                if (!member) {
                    member = groupDetails.groupMemberDetails.managers.find((mgr: any) => mgr._id.toString() === participantId.toString());
                }
                if (!member) {
                    member = groupDetails.groupMemberDetails.businessOwners.find((owner: any) => owner._id.toString() === participantId.toString());
                }
    
                if (member) {
                    membersDTO.push({
                        _id: member._id.toString(),
                        name: member.personalDetails.employeeName || member.personalDetails.managerName || member.personalDetails.businessOwnerName || 'Unknown',
                        profilePicture: member.personalDetails.profilePicture ? `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${member.personalDetails.profilePicture}` : member.personalDetails.profilePicture,
                        position:  member.role || 'Business Owner',
                    });
                }
            }
    
            return membersDTO;
        } catch (error) {
            console.error("Error in service layer:", error);
            throw new Error("Error retrieving group members");
        }
    }

    async getGroupDetails(groupId: string ,businessOwnerId: string): Promise<IGroupDTO> {
        try {
            const groupDetails = await this._chatRepository.getGroupDetails(groupId , businessOwnerId);
    
            if (!groupDetails) {
                throw new Error("Group details not found");
            }
    
            const participants = groupDetails.participants || [];
            const membersDTO: IMembers[] = [];
    
            for (const participantId of participants) {
                let member: any = null;
    
                if (groupDetails.groupMemberDetails) {
                    const { employees = [], managers = [], businessOwners = [] } = groupDetails.groupMemberDetails;
    
                    member = employees.find((emp: any) => emp._id?.toString() === participantId.toString()) ||
                             managers.find((mgr: any) => mgr._id?.toString() === participantId.toString()) ||
                             businessOwners.find((owner: any) => owner._id?.toString() === participantId.toString());
                }
    
                if (member) {
                    const name = member.name || 'Unknown';
                    const profilePicture = member.profilePicture 
                        ? `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${member.profilePicture}` 
                        : "https://cdn.pixabay.com/photo/2018/08/28/12/41/avatar-3637425_1280.png";
    
                    const position = member.position || member.role || 'Unknown';
    
                    membersDTO.push({
                        _id: member._id?.toString(),
                        name,
                        profilePicture,
                        position,
                    });
                }
            }
    
            return {
                _id: groupDetails._id?.toString(),
                groupName: groupDetails.groupName || 'Unnamed Group',
                participants: membersDTO,
                chatType: groupDetails.chatType || 'Unknown',
                groupAdmin: groupDetails.groupAdmin || 'Unknown',
                businessOwnerId: businessOwnerId as string
            };
        } catch (error) {
            console.error("Error in service layer:", error);
            throw new Error("Error retrieving group members");
        }
    }

    async deleteGroup(groupId: string , businessOwnerId: string): Promise<void> {
        try {
            await this._chatRepository.deleteGroup(groupId , businessOwnerId);
        } catch (error) {
            console.error("Error in service layer:", error);
            throw new Error("Error deleting group");
        }
    }
    

    async getAllUnAddedUsers(groupId: string, myId: string , businessOwnerId: string): Promise<IUnAddedUsersDTO[]> {
        try {
            const employees = await this._chatRepository.findAllEmployees(businessOwnerId) ;
            const managers = await this._chatRepository.findAllManagers(businessOwnerId);
            const businessOwners = await this._chatRepository.findAllBusinessOwners(businessOwnerId);
            const chatData = await this._chatRepository.getChatParticipants(groupId ,businessOwnerId);
            const chatParticipants = (chatData.participants || []).map((p: any) => p.toString());
        
            const buisinessOwnereDTO: IUnAddedUsersDTO[] = businessOwners.map(businessOwner => ({
                _id: businessOwner._id,
                name: businessOwner.personalDetails.businessOwnerName,
                position: businessOwner.role || "Business Owner", // Provide a default value
                profilePicture: businessOwner.personalDetails.profilePicture
                    ? `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${businessOwner.personalDetails.profilePicture}`
                    : "https://cdn.pixabay.com/photo/2018/08/28/12/41/avatar-3637425_1280.png", // Fallback for undefined profilePicture
            }));
    
            const employeeDTO: IUnAddedUsersDTO[] = employees.map(employee => ({
                _id: employee._id,
                name: employee.personalDetails.employeeName,
                position: employee.professionalDetails.position || "Employee", // Provide a default value
                profilePicture: employee.personalDetails.profilePicture
                    ? `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${employee.personalDetails.profilePicture}`
                    : "https://cdn.pixabay.com/photo/2018/08/28/12/41/avatar-3637425_1280.png", // Fallback for undefined profilePicture
            }));
    
            const managerDTO: IUnAddedUsersDTO[] = managers.map(manager => ({
                _id: manager._id,
                name: manager.personalDetails.managerName,
                position: manager.role || "Manager", // Provide a default value
                profilePicture: manager.personalDetails.profilePicture
                    ? `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${manager.personalDetails.profilePicture}`
                    : "https://cdn.pixabay.com/photo/2018/08/28/12/41/avatar-3637425_1280.png", // Fallback for undefined profilePicture
            }));
    
            const receiverDTO = [...employeeDTO, ...managerDTO, ...buisinessOwnereDTO].filter(
                receiver => receiver._id.toString() !== myId && !chatParticipants.includes(receiver._id.toString())
            );
        
            return receiverDTO;
        } catch (error) {
            console.error("Error in getAllUnAddedUsers:", error);
            throw new Error("Error getting all unadded users");
        }
    }

    async updateGroup(groupId: string, data: any ,businessOwnerId: string): Promise<IGroupDTO> {
        try {
            const groupDetails = await this._chatRepository.updateGroup(groupId, data ,businessOwnerId);
            if (!groupDetails) {
                throw new Error("Group details not found");
            }
    
            const participants = groupDetails.participants || [];
            const membersDTO: IMembers[] = [];
    
            for (const participantId of participants) {
                let member: any = null;
    
                if (groupDetails.groupMemberDetails) {
                    const { employees = [], managers = [], businessOwners = [] } = groupDetails.groupMemberDetails;
    
                    member = employees.find((emp: any) => emp._id?.toString() === participantId.toString()) ||
                             managers.find((mgr: any) => mgr._id?.toString() === participantId.toString()) ||
                             businessOwners.find((owner: any) => owner._id?.toString() === participantId.toString());
                }
    
                if (member) {
                    const name = member.name || 'Unknown';
                    const profilePicture = member.profilePicture 
                        ? `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${member.profilePicture}` 
                        : "https://cdn.pixabay.com/photo/2018/08/28/12/41/avatar-3637425_1280.png";
    
                    const position = member.position || member.role || 'Unknown';
    
                    membersDTO.push({
                        _id: member._id?.toString(),
                        name,
                        profilePicture,
                        position,
                    });
                }
            }
    
            return {
                _id: groupDetails._id?.toString(),
                groupName: groupDetails.groupName || 'Unnamed Group',
                participants: membersDTO,
                chatType: groupDetails.chatType || 'Unknown',
                groupAdmin: groupDetails.groupAdmin || 'Unknown',
            };
            
        } catch (error) {
            console.error("Error in updateGroup:", error);
            throw new Error("Error updating group");
        }
    }
    
    async updateLastSeen(userId: string ,businessOwnerId: string): Promise<IResponseDTO> {
        try {
          const result = await this._chatRepository.updateLastSeenForChats( userId ,businessOwnerId);
          return { success: true, message: "Last seen updated successfully!", data: result };
        } catch (error:any) {
          throw new Error(error.message || "Error while updating last seen");
        }
    }
    
    
    
}