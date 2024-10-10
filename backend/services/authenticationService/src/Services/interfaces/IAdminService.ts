// src/interfaces/IAdmin.ts
import { ObjectId } from 'mongoose'; // Use mongoose's ObjectId for consistency

export interface IAdmin {
    _id: ObjectId; // Use ObjectId from mongoose
    email: string;
    password: string;
    role: string;
}

export interface ILoginResponse {
    token: string;
    admin: IAdmin; // Expect admin to be of type IAdmin
}
