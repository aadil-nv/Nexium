
import IManagerRepoitory from "../../repository/interface/IManagerReopsitory";
import IManagerService from "../interface/IManagerService";
import { inject, injectable } from "inversify";


@injectable()
export default class ManagerService implements IManagerService {

    private managerRepository: IManagerRepoitory

    constructor(@inject("IManagerRepoitory") managerRepository: IManagerRepoitory) {
        this.managerRepository = managerRepository;
    }

    async getProfile(companyId: string, managerId: string): Promise<any> {    
       try {
        return await this.managerRepository.getProfile(companyId,managerId)
       } catch (error) {
        console.error("Error fetching manager profile:", error);
        throw error
       }
    }
}