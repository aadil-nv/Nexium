// src/Repositery/implementaion/adminRepository.ts
import Admin from "../../Schemas/superAdminSchema";
import { ISuperAdmin } from "../interfaces/ISuperAdminRepository";

class SuperAdminRepository {
  async findByEmail(email: string): Promise<ISuperAdmin | null> {
    return await Admin.findOne({ email }).exec();
  }


  async create(adminData: Partial<ISuperAdmin>): Promise<ISuperAdmin> {
    const admin = new Admin(adminData);
    return await admin.save();
  }


  async findById(id: string): Promise<ISuperAdmin | null> {
    return await Admin.findById(id).exec();
  }
}

export default new SuperAdminRepository();
