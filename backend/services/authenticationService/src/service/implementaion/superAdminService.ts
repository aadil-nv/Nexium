import bcrypt from "bcryptjs";
import { ISuperAdmin } from "../../entities/superAdminEntities";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../../utils/businessOwnerJWT";
import ISuperAdminService from "../interfaces/ISuperAdminService";
import ISuperAdminRepository from "../../repository/interfaces/ISuperAdminRepository";
import { inject, injectable } from "inversify";

@injectable()
export default class SuperAdminService implements ISuperAdminService {
  private _superAdminRepository: ISuperAdminRepository;

  constructor(
    @inject("ISuperAdminRepository") superAdminRepository: ISuperAdminRepository
  ) {
    this._superAdminRepository = superAdminRepository;
  }

  async login(email: string, password: string): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const admin = await this._superAdminRepository.findByEmail(email);
      if (!admin) {
        throw new Error("Invalid credentials");
      }

      const isMatch = await bcrypt.compare(password, admin.password as string);
      if (!isMatch) {
        throw new Error("Invalid credentials");
      }

      const accessToken = generateAccessToken({ admin });
      const refreshToken = generateRefreshToken({ admin });

      return { accessToken, refreshToken };
    } catch (error) {
      console.log("Error logging in:", error);
      throw error;
    }
  }

  async register(username: string, email: string, password: string): Promise<Omit<ISuperAdmin, "password">> {
    const existingAdmin = await this._superAdminRepository.findByEmail(email);
    if (existingAdmin) {
      throw new Error("Email already in use");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = await this._superAdminRepository.create({
      username,
      email,
      password: hashedPassword,
    });

    const { password: _, ...adminWithoutPassword } = newAdmin;
    return adminWithoutPassword as Omit<ISuperAdmin, "password">;
  }

  async setNewAccessToken(refreshToken: string): Promise<string> {
    try {
      const decoded = verifyRefreshToken(refreshToken);
      if (!decoded) {
        throw new Error("Invalid or expired refresh token");
      }

      const newAccessToken = generateAccessToken({ decoded });
      return newAccessToken;
    } catch (error) {
      console.log("Error generating new access token:", error);
      throw new Error("Error generating new access token: " + error);
    }
  }
}
