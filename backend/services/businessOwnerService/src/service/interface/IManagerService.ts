
export default interface IManagerService {
    getAllManagers(businessOwnerId: string): Promise<any[]>
    addManagers(businessOwnerId: string, managerData: any): Promise<any>
}