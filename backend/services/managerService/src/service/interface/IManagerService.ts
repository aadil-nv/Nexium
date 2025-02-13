import { IDocumentDTO } from "dto/IEmployeesDTO"
import  IEmployee  from "../../entities/employeeEntities"

export default interface IManagerService {
    getManagers(businessOwnerId: string): Promise<any>
    getManagerPersonalInfo(managerId: string,businessOwnerId: string): Promise<any>
    getManagerProfessionalInfo(managerId: string,businessOwnerId: string): Promise<any>
    getManagerAddress(managerId: string,businessOwnerId: string): Promise<any>
    getManagerCredentials(managerId: string,businessOwnerId: string): Promise<any>
    getManagerDocuments(managerId: string,businessOwnerId: string): Promise<any>
    updateManagerPersonalInfo(managerId: string , data: any ,businessOwnerId: string): Promise<any>
    setNewAccessToken(refreshToken: string): Promise<string>
    updateManagerProfilePicture(managerId: string, file: Express.Multer.File , businessOwnerId: string): Promise<any>
    getLeaveEmployees(managerId: string ,businessOwnerId: string): Promise<IEmployee>
    updateManagerAddress(managerId: string, data: any,businessOwnerId: string): Promise<any>
    uploadDocuments(managerId: string, file: Express.Multer.File, fileType: string ,businessOwnerId: string): Promise<IDocumentDTO>
    updateManagerIsActive(managerId: string, isActive: boolean ,businessOwnerId: string): Promise<any>
}