
import { Schema, model, Document } from 'mongoose';
import { ISuperAdmin } from '../entities/superAdminEntities'; 

const adminSchema = new Schema<ISuperAdmin & Document>({
    username: { type: String, required: true, unique: true }, 
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'superAdmin' }, 
});


const Admin = model<ISuperAdmin>('Admin', adminSchema);
export default Admin;
