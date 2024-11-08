
import IManager from "../../entities/managerEntity";
export default interface IManagerRepository {
    getProfile(companyId: string, managerId: string): Promise<IManager>;
}    