import IBusinessOwnerService from "../interface/IBusinessOwnerService";
import businessOwnerRepository from "../../repository/implementation/businessOwnerRepository";
import IBusinessOwnerRepository from "../../repository/interface/IBusinessOwnerRepository";
import { injectable,inject } from "inversify";


@injectable()
export default class BusinessOwnerService implements IBusinessOwnerService {
    private businessOwnerRepository:IBusinessOwnerRepository;
    constructor(@inject("IBusinessOwnerRepository") businessOwnerRepository:IBusinessOwnerRepository) {
        this.businessOwnerRepository = businessOwnerRepository;
    }

    async fetchAllBusinessOwners():Promise<any> {
        try {
           const managers = await this.businessOwnerRepository.fetchAllBusinessOwners();
           return managers 
        } catch (error) {
            console.log(error);
            throw new Error("Error while fetching managers");  
        }
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