import IBusinessOwnerService from "../interface/IBusinessOwnerService";
import businessOwnerRepository from "../../repository/implementation/businessOwnerRepository";
import IBusinessOwnerRepository from "../../repository/interface/IBusinessOwnerRepository";
import { injectable,inject } from "inversify";
import {generateCompanyAccessToken,verifyAccessToken,verifyRefreshToken,generateCompanyRefreshToken} from "../../utils/jwt"

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
    
    async updateIsBlocked(id:string):Promise<any> {
        try {
            const updatedBusinessOwner = await this.businessOwnerRepository.updateIsBlocked(id);
            return updatedBusinessOwner
        } catch (error) {
            console.log(error);
            throw new Error("Error while updating isBlocked");
        }
    }

    async setNewAccessToken(refreshToken: string): Promise<string> {
    
        try {
          const decoded = verifyRefreshToken(refreshToken);
    
          if (!decoded) {
            throw new Error("Invalid or expired refresh token");
          }

          const newAccessToken = generateCompanyAccessToken({ decoded });
    
          if (!newAccessToken) {
            throw new Error("Failed to generate a new access token");
          }
    
          return newAccessToken;
        } catch (error) {
          console.log("Error generating new access token:", error);    
          throw new Error("Invalid or expired refresh token");
        }
      }

}