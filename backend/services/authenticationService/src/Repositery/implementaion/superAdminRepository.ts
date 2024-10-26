// src/Repositery/implementaion/adminRepository.ts
import Admin from "../../Schemas/superAdminSchema";
import { ISuperAdmin } from "../interfaces/ISuperAdminRepository";
import { injectable } from "inversify";
import ISuperAdminRepository from "../interfaces/ISuperAdminRepository";

@injectable()
export default class SuperAdminRepository implements ISuperAdminRepository  {
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


