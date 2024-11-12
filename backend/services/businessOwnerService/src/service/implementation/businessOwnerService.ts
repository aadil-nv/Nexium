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
   

    async registerBusinessOwner(businessOwnerData:string):Promise<any> {

        try {
            const newBusinessOwner = await this.businessOwnerRepository.registerBusinessOwner(businessOwnerData );
            return newBusinessOwner
            
        } catch (error) {
            console.log(error);
            throw new Error("Error while registering manager");
        }
    }

    async setNewAccessToken(refreshToken: string): Promise<string> {
       
        try {
          const decoded =verifyRefreshToken(refreshToken);
          if (!decoded) {
            throw new Error("Invalid or expired refresh token");
          }
          const newAccessToken = generateCompanyAccessToken({decoded});
          return newAccessToken;
        } catch (error) {

          console.log("Error generating new access token:", error);
          throw new Error("Error generating new access token: " + error);
        }
      }
}
