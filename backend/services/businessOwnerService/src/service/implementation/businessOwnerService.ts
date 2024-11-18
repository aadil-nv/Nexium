import IBusinessOwnerService from "service/interface/IBusinessOwnerService";
import IBusinessOwnerRepository from "../../repository/interface/IBusinessOwnerRepository";
import { inject, injectable } from "inversify";
import { verifyRefreshToken, generateAccessToken } from "../../utils/jwt";

@injectable()
export default class BusinessOwnerService implements IBusinessOwnerService {
  private _businessOwnerRepository: IBusinessOwnerRepository;

  constructor(@inject("IBusinessOwnerRepository") businessOwnerRepository: IBusinessOwnerRepository) {
    this._businessOwnerRepository = businessOwnerRepository;
  }

  async registerBusinessOwner(businessOwnerData: string): Promise<any> {
    try {
      return await this._businessOwnerRepository.registerBusinessOwner(businessOwnerData);
    } catch (error) {
      throw new Error("Error while registering business owner");
    }
  }

  async setNewAccessToken(refreshToken: string): Promise<string> {
    try {
      const decoded = verifyRefreshToken(refreshToken);
      const businessOwnerData = decoded?.businessOwnerData;

      if (!decoded || !businessOwnerData) {
        throw new Error("Invalid or expired refresh token");
      }

      return generateAccessToken({ businessOwnerData });
    } catch (error) {
      throw new Error("Error generating new access token: " + error);
    }
  }

  async addSubscription(subscriptionData: any): Promise<any> {
    try {
      const newSubscription = await this._businessOwnerRepository.addSubscription(subscriptionData);
      return { success: true, message: "Subscription added successfully!", subscription: newSubscription };
    } catch (error) {
      return { success: false, message: "Could not add subscription due to an internal error." };
    }
  }
}
