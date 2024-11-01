import bcrypt from "bcryptjs";
import {ISuperAdmin} from "../../entities/superAdminEntities";
import {generateAccessToken,generateRefreshToken,} from "../../utils/jwt";
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

  async login(email: string, password: string): Promise<{ token: string; refreshToken: string }> {
    console.log("Touching login service");
    console.log("email", email, "password", password);

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

    const token = generateAccessToken(admin as ISuperAdmin);
    console.log("token", token);

    const refreshToken = generateRefreshToken(admin as ISuperAdmin);
    console.log("refreshToken", refreshToken);

    return {
      token,
      refreshToken,
    };
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

  // Keep this function if you need it later
  /*
  async verifyRefreshToken(token: string): Promise<Omit<ISuperAdmin, "password"> | null> {
    const decoded = verifyRefreshToken(token);
    if (!decoded) {
      throw new Error("Invalid refresh token.");
    }
    const admin = await this.findById(decoded.id);
    if (!admin) {
      throw new Error("Admin not found");
    }
    const { password: _, ...adminWithoutPassword } = admin;
    return adminWithoutPassword as Omit<ISuperAdmin, "password">;
  }
  */

  // Uncomment if needed later
  /*
  async findById(id: string): Promise<ISuperAdmin | null> {
    return await this.superAdminRepository.findById(id);
  }
  */
}

// Create and export an instance of SuperAdminService
