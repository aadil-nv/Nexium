import ISuperAdminService from "../../service/interface/ISuperAdminService";
import { inject, injectable } from "inversify";
import { generateAccessToken, verifyRefreshToken } from "../../utils/jwt";
import ISuperAdminRepository from "../../repository/interface/ISuperAdminRepository";

@injectable()
export default class SuperAdminService implements ISuperAdminService {
  private _superAdminRepository: ISuperAdminRepository;

  constructor(@inject("ISuperAdminRepository") superAdminRepository: ISuperAdminRepository) {
    this._superAdminRepository = superAdminRepository;
  }

  async setNewAccessToken(refreshToken: string): Promise<string> {
    try {
      const decoded = verifyRefreshToken(refreshToken);

      if (!decoded) {
        throw new Error("Invalid or expired refresh token");
      }

      const newAccessToken = generateAccessToken({ decoded });

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
