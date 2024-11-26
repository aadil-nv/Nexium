import { IResponseDTO } from "dto/businessOwnerDTO"
import { IManager } from "entities/managerEntity"

export default interface IManagerService {
    getAllManagers(businessOwnerId: string): Promise<any[]>
    addManagers(businessOwnerId: string, data: any): Promise<IResponseDTO>
    sendOfferLetter(managerName: string, managerCredentials: any ,managerEmail: string): Promise<any>
}