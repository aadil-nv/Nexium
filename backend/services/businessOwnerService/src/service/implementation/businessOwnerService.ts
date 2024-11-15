// businessOwnerService.ts
import IBusinessOwnerService from "service/interface/IBusinessOwnerService";
import IManager from "../../entities/managerEntity";
import IBusinessOwnerRepository from "../../repository/interface/IBusinessOwnerRepository";
import { inject, injectable } from "inversify";
import {verifyRefreshToken,generateAccessToken,generateRefreshToken,verifyAccessToken} from "../../utils/jwt"
import { decode } from "punycode";

@injectable()
export default class BusinessOwnerService implements IBusinessOwnerService {
    private businessOwnerRepository: IBusinessOwnerRepository;

    constructor(@inject("IBusinessOwnerRepository") businessOwnerRepository: IBusinessOwnerRepository) {
        this.businessOwnerRepository = businessOwnerRepository;
    }

    // Implementing the findAllCompanies method
   

    async registerBusinessOwner(businessOwnerData:string):Promise<any> {
        try {
            const newBusinessOwner = await this.businessOwnerRepository.registerBusinessOwner(businessOwnerData);
            return newBusinessOwner
            
        } catch (error) {
            console.log(error);
            throw new Error("Error while registering manager");
        }
    }

    async setNewAccessToken(refreshToken: string): Promise<string> {
        try {
          console.log(`"hitting the service layer setNewAccessToken ------------"`.bgMagenta,refreshToken);
          const decoded = verifyRefreshToken(refreshToken);
          const businessOwnerData = decoded?.businessOwnerData; // Get the company data directly
      
          if (!decoded || !businessOwnerData) {
            throw new Error("Invalid or expired refresh token");
            
          }
      
          // Log the company data (optional)
          console.log("Decoded company data from service layer:", businessOwnerData);
      
          // Generate the new access token based on the company data
          const newAccessToken = generateAccessToken({  businessOwnerData });
      
          // Log the new access token (optional)
          console.log("Generated new access token:", newAccessToken);
      
          return newAccessToken;
        } catch (error) {
          console.error("Error generating new access token:", error);
          throw new Error("Error generating new access token: " + error);
        }
      }

      async addSubscription(subscriptionData: any): Promise<any> {
        console.log(`"hitting the service layer add subscription ------------"`.bgWhite);
        
        try {
            console.log(`"subscriptionData ------------"`.bgBlue, subscriptionData);
            
          const newSubscription = await this.businessOwnerRepository.addSubscription(subscriptionData);
          return { success: true, message: "Subscription added successfully!", subscription: newSubscription };
        } catch (error) {
          console.error("Error adding subscription:", error);
          return { success: false, message: "Could not add subscription due to an internal error." };
        }
      }
      
}
