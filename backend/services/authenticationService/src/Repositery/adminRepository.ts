import Admin from '../Schemas/adminSchema';

class AdminRepository {
    async findByEmail(email: string) {
        return await Admin.findOne({ email });
    }

    async create(adminData: { email: string; password: string; role: string }) {
        const newAdmin = new Admin(adminData);
        return await newAdmin.save();
    }
}

export default new AdminRepository();
