// src/Repositery/implementaion/adminRepository.ts
import Admin from '../../Schemas/adminSchema';
import { IAdmin } from '../../entities/adminEntity'; // Use the centralized interface

class AdminRepository {
    async findByEmail(email: string): Promise<IAdmin | null> {
        return await Admin.findOne({ email }) as IAdmin | null; 
    }
}

export default new AdminRepository();
