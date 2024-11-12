
import IManager from "../../entities/managerEntity";
export default interface IManagerRepository {
    getProfile(companyId: string, managerId: string): Promise<IManager>;
    getAllManagers(companyId: string): Promise<IManager[]>
    addManagers(businessOwnerId: string, managerData: IManager): Promise<IManager>
}    