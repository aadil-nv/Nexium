import AdminRepository from '../Repositery/adminRepository';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

class AdminService {
    async registerAdmin(email: string, password: string, role: string = 'admin') {
        const existingAdmin = await AdminRepository.findByEmail(email);
        if (existingAdmin) {
            throw new Error('Admin already exists');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        return await AdminRepository.create({ email, password: hashedPassword, role });
    }

    async login(email: string, password: string) {
        const admin = await AdminRepository.findByEmail(email);
        if (!admin) {
            throw new Error('Invalid credentials');
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            throw new Error('Invalid credentials');
        }

        const token = jwt.sign({ id: admin._id, role: admin.role }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });
        return { token, admin };
    }
}

export default new AdminService();
