// businessOwnerService.ts
import IBusinessOwnerService from "service/interface/IBusinessOwnerService";
import IManager from "../../entities/managerEntity";
import IBusinessOwnerRepository from "../../repository/interface/IBusinessOwnerRepository";
import { inject, injectable } from "inversify";
import {verifyRefreshToken,generateCompanyAccessToken,generateCompanyRefreshToken,verifyAccessToken} from "../../utils/jwt"

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

    async addManagers(businessOwnerId: string, managerData: IManager): Promise<IManager> {
        console.log("BusinessOwnerService - Adding HR Manager:", managerData);
        console.log("BusinessOwnerService - businessOwnerId ID:", businessOwnerId);

        // Validate the HR Manager data before adding
        if (!managerData.name || !managerData.email) {
            throw new Error("Name and email are required");
        }


        return await this.businessOwnerRepository.addManagers(businessOwnerId,managerData);
    }

    async registerBusinessOwner(businessOwnerData:string):Promise<any> {

        console.log("businessOwnerData from service -------------",businessOwnerData);
        
        try {
            const newBusinessOwner = await this.businessOwnerRepository.registerBusinessOwner(businessOwnerData );
            return newBusinessOwner
            
        } catch (error) {
            console.log(error);
            throw new Error("Error while registering manager");
        }
    }

    async setNewAccessToken(refreshToken: string): Promise<string> {
        console.log("setNewAccessToken calinn-------------------------------", refreshToken);
        
        try {
          const decoded =verifyRefreshToken(refreshToken);
          
          if (!decoded) {
            throw new Error("Invalid or expired refresh token");
          }
          console.log("decoded", decoded);
          
          const newAccessToken = generateCompanyAccessToken({decoded});
    
          return newAccessToken;
        } catch (error) {
          console.log("Error generating new access token:", error);
          
          throw new Error("Error generating new access token: " + error);
        }
      }
}
