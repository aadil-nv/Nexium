
import superAdminRepository from "../../Repositery/implementaion/superAdminRepository";
import bcrypt from "bcryptjs";
import { ISuperAdmin, IExtendedLoginResponse } from "../interfaces/ISuperAdminService";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../../Utils/jwt";

class SuperAdminService {
  async login(
    email: string,
    password: string
  ): Promise<IExtendedLoginResponse> {
    const admin: ISuperAdmin | null = await superAdminRepository.findByEmail(email);
    if (!admin) {
      throw new Error("Invalid credentials");
    }

    const isMatch = await bcrypt.compare(password, admin.password as string);
    if (!isMatch) {
      throw new Error("Invalid credentials");
    }

    const token = generateAccessToken(admin);
    const refreshToken = generateRefreshToken(admin);

    const { password: _, ...adminWithoutPassword } = admin;

    return {
      token,
      refreshToken,
      admin: adminWithoutPassword as Omit<ISuperAdmin, "password">,
    };
  }

  async register(
    username: string,
    email: string,
    password: string
  ): Promise<Omit<ISuperAdmin, "password">> {
    const existingAdmin = await superAdminRepository.findByEmail(email);
    if (existingAdmin) {
      throw new Error("Email already in use");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = await superAdminRepository.create({
      username,
      email,
      password: hashedPassword,
    });

    const { password: _, ...adminWithoutPassword } = newAdmin;
    return adminWithoutPassword as Omit<ISuperAdmin, "password">;
  }

  async verifyRefreshToken(
    token: string
  ): Promise<Omit<ISuperAdmin, "password"> | null> {
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

  async findById(id: string): Promise<ISuperAdmin | null> {
    return await superAdminRepository.findById(id);
  }
}

export default new SuperAdminService();
