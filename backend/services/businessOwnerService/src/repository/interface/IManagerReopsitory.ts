
import IManager from "../../entities/managerEntity";
export default interface IManagerRepository {
    addManagers(businessOwnerId: string, managerData: IManager): Promise<IManager>
    getAllManagers(businessOwnerId: string): Promise<IManager[]>
}    