import { ManagerDTO } from "dto/managerDTO"
import { IResponseDTO } from "../../dto/businessOwnerDTO"
import { IManager } from "../../entities/managerEntity"

export default interface IManagerService {
    getAllManagers(businessOwnerId: string): Promise<any[]>
    addManagers(businessOwnerId: string, data: any): Promise<IResponseDTO>
    sendOfferLetter(managerName: string, managerCredentials: any ,managerEmail: string): Promise<any>
    blockManager(businessOwnerId: string, data: any): Promise<IResponseDTO>
    getManager(businessOwnerId: string, managerId: string): Promise<ManagerDTO>
    updatePersonalInfo(businessOwnerId: string, managerId: string, data: any): Promise<IManager>
    updateProfessionalInfo(businessOwnerId: string, managerId: string, data: any): Promise<IManager>
    updateAddressInfo(businessOwnerId: string, managerId: string, data: any): Promise<IManager>
    uploadProfilePic(businessOwnerId: string, managerId: string, file: any): Promise<IManager>
    updateResume(businessOwnerId: string, managerId: string, file: any): Promise<IManager>
}