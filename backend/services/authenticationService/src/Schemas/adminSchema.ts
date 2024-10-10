// src/Schemas/adminSchema.ts
import { Schema, model,Document } from 'mongoose';
import { IAdmin } from '../entities/adminEntity'; // Import the same IAdmin interface


const adminSchema = new Schema<IAdmin & Document>({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true },
});

// Create the Admin model using the schema
const Admin = model<IAdmin>('Admin', adminSchema);
export default Admin;