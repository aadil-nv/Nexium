// businessOwnerService.ts
import IBusinessOwnerService from "service/interface/IBusinessOwnerService";
import IManager from "../../entities/managerEntity";
import IBusinessOwnerRepository from "../../repository/interface/IBusinessOwnerRepository";
import { inject, injectable } from "inversify";

@injectable()
export default class BusinessOwnerService implements IBusinessOwnerService {
    private businessOwnerRepository: IBusinessOwnerRepository;

    constructor(@inject("IBusinessOwnerRepository") businessOwnerRepository: IBusinessOwnerRepository) {
        this.businessOwnerRepository = businessOwnerRepository;
    }

    // Implementing the findAllCompanies method
    async findAllManagers(comapanyId: string): Promise<any[]> {
        console.log("BusinessOwnerService - Fetching all registered companies");
        return await this.businessOwnerRepository.findAllManagers(comapanyId ); // Ensure this method is implemented in your repository
    }

    async addManagers(companyId: string, hrManagerData: IManager): Promise<IManager> {
        console.log("BusinessOwnerService - Adding HR Manager:", hrManagerData);
        console.log("BusinessOwnerService - Company ID:", companyId);

        // Validate the HR Manager data before adding
        if (!hrManagerData.name || !hrManagerData.email) {
            throw new Error("Name and email are required");
        }


        return await this.businessOwnerRepository.addManagers(companyId,hrManagerData);
    }

    async registerBusinessOwner(businessOwnerData:string):Promise<any> {

        console.log("businessOwnerData from service -------------",businessOwnerData);
        
        try {
            const newBusinessOwner = await this.businessOwnerRepository.registerBusinessOwner(businessOwnerData);
            return newBusinessOwner
            
        } catch (error) {
            console.log(error);
            throw new Error("Error while registering manager");
        }
    }
}
