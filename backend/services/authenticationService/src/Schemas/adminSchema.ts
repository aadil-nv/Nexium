import mongoose, { Schema, Document } from 'mongoose';
import { IAdmin } from '../entities/adminEntity';

const AdminSchema: Schema = new Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            required: true,
            default: 'admin',
        },
    },
    {
        timestamps: true, 
    }
);

export default mongoose.model<IAdmin>('Admin', AdminSchema);
