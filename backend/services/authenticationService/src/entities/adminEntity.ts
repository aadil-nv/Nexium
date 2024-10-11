// src/entities/adminEntity.ts
import { ObjectId } from 'mongoose'; // Use mongoose's ObjectId for consistency

export interface IAdmin {
    _id: ObjectId;  // Change 'id' to '_id' to match Mongoose convention
    username: string;
    email: string;
    password?: string;
    role?: string ;
    // Other fields...
}

export interface IExtendedLoginResponse {
    token: string;                     // Access token for authentication
    refreshToken: string;              // Refresh token to obtain new access tokens
    admin: Omit<IAdmin, 'password'>;   // Ensure password is omitted in responses for security
}
