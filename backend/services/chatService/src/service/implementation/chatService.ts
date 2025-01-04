import { inject , injectable } from "inversify";
import  IChatService from "../interface/IChatService";
import { IChatResponseDTO, IReceiverDTO, ISetNewAccessTokenDTO } from "../../dto/chatDTO";
import  IChatRepository  from "../../repository/interface/IChatRepository";
import { generateAccessToken, verifyRefreshToken } from "../../utils/jwt";

@injectable()

export default  class ChatService implements IChatService {
    constructor(@inject("IChatRepository") private _chatRepository: IChatRepository) {}
    async createChat(chat: any): Promise<IChatResponseDTO> {
        try {
            const createdChat = await this._chatRepository.createChat(chat);
            return {
                message: "Chat created successfully",
                success: true
            }
            
        } catch (error) {
            throw new Error("Error creating chat");
            
        }
    }

    async getAllReceiver(): Promise<IReceiverDTO[]> {
        // console.log("getAllReceiver called service layer {{{{{{}}}}}}}}}}}}}");
        
        try {
            const employees = await this._chatRepository.findAllEmployees();
            const managers = await this._chatRepository.findAllManagers();
            // console.log(`getAllReceiver employees: ${employees}`.bgCyan,managers);
            
            const businessOwners = await this._chatRepository.findAllBusinessOwners();
            // console.log(`getAllReceiver businessOwners: ${businessOwners}`.bgCyan,businessOwners);
            

            const lastSeend = new Date();
            // console.log("getAllReceiver response:---> ",employees);
            

            const receiverDTO: IReceiverDTO[] = employees.map(receiver => ({
                receiverId: receiver._id,
                receiverName: receiver.personalDetails.employeeName,
                status: receiver.isActive, 
                lastSeen: lastSeend  ,
                receiverProfilePicture: receiver.personalDetails.profilePicture ? `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${receiver.personalDetails.profilePicture}` : receiver.personalDetails.profilePicture
            }))
            return receiverDTO;
            
        } catch (error) {
            throw new Error("Error getting all employees");
            
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