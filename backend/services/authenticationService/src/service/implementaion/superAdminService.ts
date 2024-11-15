import bcrypt from "bcryptjs";
import {ISuperAdmin} from "../../entities/superAdminEntities";
// import {generateAccessToken,generateRefreshToken,} from "../../utils/jwt";
import {generateAccessToken,generateRefreshToken,verifyAccessToken,verifyRefreshToken} from "../../utils/businessOwnerJWT";
import ISuperAdminService from "../interfaces/ISuperAdminService";
import ISuperAdminRepository from "../../repository/interfaces/ISuperAdminRepository";
import { inject, injectable } from "inversify";

@injectable()
export default class SuperAdminService implements ISuperAdminService {
  private superAdminRepository: ISuperAdminRepository;

  constructor(
    @inject("ISuperAdminRepository") superAdminRepository: ISuperAdminRepository
  ) {
    this.superAdminRepository = superAdminRepository;
  }

  async login(email: string, password: string): Promise<{ accessToken: string; refreshToken: string }> {
        console.log("login service", email, password);
    try {
      const admin = await this.superAdminRepository.findByEmail(email);
      console.log("admin", admin);

    if (!admin) {
      throw new Error("Invalid credentials");
    }

    const isMatch = await bcrypt.compare(password, admin.password as string);
    console.log("isMatch", isMatch);

    if (!isMatch) {
      throw new Error("Invalid credentials");
    }

    const accessToken = generateAccessToken({admin});
    const refreshToken = generateRefreshToken({admin});

    return {
      accessToken,
      refreshToken,
    }
      
    } catch (error) {
      console.log("Error logging in:", error);
      throw error;
    }
  }

  async register(username: string, email: string, password: string): Promise<Omit<ISuperAdmin, "password">> {
    const existingAdmin = await this.superAdminRepository.findByEmail(email);
    if (existingAdmin) {
      throw new Error("Email already in use");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = await this.superAdminRepository.create({
      username,
      email,
      password: hashedPassword,
    });

    const { password: _, ...adminWithoutPassword } = newAdmin;
    return adminWithoutPassword as Omit<ISuperAdmin, "password">;
  }

  async setNewAccessToken(refreshToken: string): Promise<string> {
    try {
      const decoded =verifyRefreshToken(refreshToken);
      
      if (!decoded) {
        throw new Error("Invalid or expired refresh token");
      }
      console.log("decoded", decoded);
      
      const newAccessToken = generateAccessToken({decoded});

      return newAccessToken;
    } catch (error) {
      console.log("Error generating new access token:", error);
      
      throw new Error("Error generating new access token: " + error);
    }
  }

 
}


