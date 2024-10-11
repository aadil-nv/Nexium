// src/Schemas/adminSchema.ts
import { Schema, model, Document } from 'mongoose';
import { IAdmin } from '../entities/adminEntity'; // Import the same IAdmin interface

const adminSchema = new Schema<IAdmin & Document>({
    username: { type: String, required: true, unique: true }, // New field for username
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'superAdmin' }, // Ensure this matches the IAdmin interface
});

// Create the Admin model using the schema
const Admin = model<IAdmin>('Admin', adminSchema);
export default Admin;
