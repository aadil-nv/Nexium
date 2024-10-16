// src/Repositery/implementaion/adminRepository.ts
import Admin from "../../Schemas/adminSchema";
import { IAdmin } from "../../entities/adminEntity";

class AdminRepository {
  async findByEmail(email: string): Promise<IAdmin | null> {
    return await Admin.findOne({ email }).exec();
  }


  async create(adminData: Partial<IAdmin>): Promise<IAdmin> {
    const admin = new Admin(adminData);
    return await admin.save();
  }


  async findById(id: string): Promise<IAdmin | null> {
    return await Admin.findById(id).exec();
  }
}

export default new AdminRepository();
