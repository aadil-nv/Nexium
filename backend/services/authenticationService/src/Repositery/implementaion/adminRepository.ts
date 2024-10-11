// src/Repositery/implementaion/adminRepository.ts
import Admin from '../../Schemas/adminSchema';
import { IAdmin } from '../../entities/adminEntity';

class AdminRepository {
    
    // Find an admin by email
    async findByEmail(email: string): Promise<IAdmin | null> {
        console.log("AdminRepository is hitting ---");
        console.log("repository email:", email);
        
        return await Admin.findOne({ email }).exec();
    }

    // Create a new admin
    async create(adminData: Partial<IAdmin>): Promise<IAdmin> {
        console.log("Admin data is -", adminData);
        
        const admin = new Admin(adminData);
        return await admin.save();
    }

    // Find an admin by ID
    async findById(id: string): Promise<IAdmin | null> {
        return await Admin.findById(id).exec();
    }
}

export default new AdminRepository();
