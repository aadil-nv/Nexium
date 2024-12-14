import  IEmployee  from "../../entities/employeeEntities"

export default interface IManagerService {
    getManagers(): Promise<any>
    getManagerPersonalInfo(managerId: string): Promise<any>
    getManagerProfessionalInfo(managerId: string): Promise<any>
    getManagerAddress(managerId: string): Promise<any>
    getManagerCredentials(managerId: string): Promise<any>
    getManagerDocuments(managerId: string): Promise<any>
    updateManagerPersonalInfo(managerId: string , data: any): Promise<any>
    setNewAccessToken(refreshToken: string): Promise<string>
    updateManagerProfilePicture(businessOwnerId: string, file: Express.Multer.File): Promise<any>
    getLeaveEmployees(managerId: string): Promise<IEmployee>
    updateManagerAddress(managerId: string, data: any): Promise<any>
    uploadDocuments(managerId: string, file: Express.Multer.File, fileType: string): Promise<any>
}