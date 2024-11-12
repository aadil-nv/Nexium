
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

    async getAllManagers(businessOwnerId: string): Promise<any[]> {
        try {
            return await this.managerRepository.getAllManagers(businessOwnerId)
        } catch (error) {
            console.error("Error fetching managers:", error);
            throw error
        }
    }

    async addManagers(businessOwnerId: string, managerData: any): Promise<any> {
        
        try {
            return await this.managerRepository.addManagers(businessOwnerId, managerData)
        } catch (error) {
            console.error("Error adding HR Manager:", error);
            throw error
        }
    }



    
}