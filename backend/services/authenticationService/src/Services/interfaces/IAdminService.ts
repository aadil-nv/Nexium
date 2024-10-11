// src/interfaces/IAdmin.ts
import { ObjectId } from 'mongoose'; // Use mongoose's ObjectId for consistency

export interface IAdmin {
    _id: ObjectId;     // Use ObjectId from mongoose
    username: string;  // Added username property
    email: string;
    password: string;
    role: string;      // Ensure this property is present if required
}

// Keep the IExtendedLoginResponse interface as defined in adminEntity
export interface IExtendedLoginResponse {
    token: string;
    refreshToken: string;
    admin: Omit<IAdmin, 'password'>; // This should match the above definition
}
