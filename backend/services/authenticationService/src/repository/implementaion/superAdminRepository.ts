import Admin from "../../model/superAdminModel";
import { ISuperAdmin } from "../interfaces/ISuperAdminRepository";
import { injectable } from "inversify";
import ISuperAdminRepository from "../interfaces/ISuperAdminRepository";

@injectable()
export default class SuperAdminRepository implements ISuperAdminRepository {
  async findByEmail(email: string): Promise<ISuperAdmin | null> {
    try {
      return await Admin.findOne({ email }).exec();
    } catch (error) {
      console.error("Error finding admin by email:", error);
      throw new Error("Failed to find admin by email");
    }
  }

  async create(adminData: Partial<ISuperAdmin>): Promise<ISuperAdmin> {
    try {
      const admin = new Admin(adminData);
      return await admin.save();
    } catch (error) {
      console.error("Error creating admin:", error);
      throw new Error("Failed to create admin");
    }
  }

  async findById(id: string): Promise<ISuperAdmin | null> {
    try {
      return await Admin.findById(id).exec();
    } catch (error) {
      console.error("Error finding admin by ID:", error);
      throw new Error("Failed to find admin by ID");
    }
  }
}
