// src/Services/implementaion/adminService.ts
import AdminRepository from '../../Repositery/implementaion/adminRepository';
import bcrypt from 'bcryptjs';
import { IAdmin, IExtendedLoginResponse } from '../../entities/adminEntity';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../../Utils/jwt';

class AdminService {

    async login(email: string, password: string): Promise<IExtendedLoginResponse> {
        const admin: IAdmin | null = await AdminRepository.findByEmail(email);
        if (!admin) {
            throw new Error('Invalid credentials');
        }

        const isMatch = await bcrypt.compare(password, admin.password as string);
        if (!isMatch) {
            throw new Error('Invalid credentials');
        }

        const token = generateAccessToken(admin);
        const refreshToken = generateRefreshToken(admin);

        // Return the admin object without the password
        const { password: _, ...adminWithoutPassword } = admin;

        return { token, refreshToken, admin: adminWithoutPassword as Omit<IAdmin, 'password'> };
    }

    // Admin registration handler
    async register(username: string, email: string, password: string): Promise<Omit<IAdmin, 'password'>> {
        console.log("adminService hitting");
        console.log("adminService ", username,email,password);
        
        const existingAdmin = await AdminRepository.findByEmail(email);
        if (existingAdmin) {
            throw new Error('Email already in use');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newAdmin = await AdminRepository.create({
            username,
            email,
            password: hashedPassword,
        });

        const { password: _, ...adminWithoutPassword } = newAdmin;
        return adminWithoutPassword as Omit<IAdmin, 'password'>;
    }

    async verifyRefreshToken(token: string): Promise<Omit<IAdmin, 'password'> | null> {
        const decoded = verifyRefreshToken(token);
        
        // Check if decoded is null
        if (!decoded) {
            throw new Error('Invalid refresh token.');
        }

        const admin = await this.findById(decoded.id);
        if (!admin) {
            throw new Error('Admin not found');
        }

        const { password: _, ...adminWithoutPassword } = admin;
        return adminWithoutPassword as Omit<IAdmin, 'password'>;
    }

    // Find admin by ID
    async findById(id: string): Promise<IAdmin | null> {
        return await AdminRepository.findById(id);
    }
}

export default new AdminService();
