import IBusinessOwnerService from "../interface/IBusinessOwnerService";
import IBusinessOwnerRepository from "../../repository/interface/IBusinessOwnerRepository";
import { injectable, inject } from "inversify";
import { generateAccessToken, verifyRefreshToken } from "../../utils/jwt";

@injectable()
export default class BusinessOwnerService implements IBusinessOwnerService {
  private _businessOwnerRepository: IBusinessOwnerRepository;

  constructor(@inject("IBusinessOwnerRepository") businessOwnerRepository: IBusinessOwnerRepository) {
    this._businessOwnerRepository = businessOwnerRepository;
  }

  async fetchAllBusinessOwners(): Promise<any> {
    try {
      return await this._businessOwnerRepository.fetchAllBusinessOwners();
    } catch (error) {
      throw new Error("Error while fetching business owners");
    }
  }


  async updateIsBlocked(id: string): Promise<any> {
    try {
      return await this._businessOwnerRepository.updateIsBlocked(id);
    } catch (error) {
      throw new Error("Error while updating isBlocked");
    }
  }

  async setNewAccessToken(refreshToken: string): Promise<string> {
    try {
      const decoded = verifyRefreshToken(refreshToken);
      const admin = decoded?.admin;

      if (!decoded || !admin) {
        throw new Error("Invalid or expired refresh token");
      }

      const newAccessToken = generateAccessToken({ admin });
      if (!newAccessToken) {
        throw new Error("Failed to generate a new access token");
      }

      return newAccessToken;
    } catch (error) {
      throw new Error("Invalid or expired refresh token");
    }
  }
}
