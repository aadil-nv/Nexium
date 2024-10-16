
import { Schema, model, Document } from 'mongoose';
import { IAdmin } from '../entities/adminEntity'; 

const adminSchema = new Schema<IAdmin & Document>({
    username: { type: String, required: true, unique: true }, 
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'superAdmin' }, 
});


const Admin = model<IAdmin>('Admin', adminSchema);
export default Admin;
