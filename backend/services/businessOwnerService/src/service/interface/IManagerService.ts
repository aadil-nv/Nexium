
export default interface IManagerService {
    getProfile(companyId: string, managerId: string): Promise<any>;
    getAllManagers(businessOwnerId: string): Promise<any[]>
    addManagers(businessOwnerId: string, managerData: any): Promise<any>
}