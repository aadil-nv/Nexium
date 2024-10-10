import AdminRepository from '../../Repositery/implementaion/adminRepository';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { IAdmin } from '../../entities/adminEntity';
import { ILoginResponse } from '../interfaces/IAdminService'; // Ensure correct import

class AdminService {
    async login(email: string, password: string): Promise<ILoginResponse> {
        const admin: IAdmin | null = await AdminRepository.findByEmail(email);
        if (!admin) {
            throw new Error('Invalid credentials');
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            throw new Error('Invalid credentials');
        }

        const token = jwt.sign({ id: admin._id.toString(), role: admin.role }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });

        return {
            token,
            admin: {
                _id: admin._id, 
                email: admin.email,
                password: admin.password, 
                role: admin.role,
            },
        };
    }
}

export default new AdminService();
