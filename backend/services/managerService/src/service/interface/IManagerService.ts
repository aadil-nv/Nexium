export default interface IManagerService {
    getManagers(): Promise<any>
    getManagerPersonalInfo(managerId: string): Promise<any>
    getManagerProfessionalInfo(managerId: string): Promise<any>
    getManagerAddress(managerId: string): Promise<any>
    getManagerCredentials(managerId: string): Promise<any>
    getManagerDocuments(managerId: string): Promise<any>
    updateManagerPersonalInfo(managerId: string , data: any): Promise<any>
    setNewAccessToken(refreshToken: string): Promise<string>
}