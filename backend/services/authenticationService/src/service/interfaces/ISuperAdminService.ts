// src/entities/adminEntity.ts
import { ObjectId } from "mongoose";

export interface ISuperAdmin {
  _id: ObjectId; // Unique identifier for the admin
  username: string; // Admin's username (required)
  email: string; // Admin's email (required)
  password?: string; // Optional password (may be omitted in responses)
  role?: string; // Optional role of the admin
}

export interface IExtendedLoginResponse {
  accessToken: string;
  refreshToken: string;

}

export default interface ISuperAdminService {
  login(email: string, password: string): Promise<IExtendedLoginResponse>;
    register(username: string, email: string, password: string): Promise<Omit<ISuperAdmin, "password">>;
    setNewAccessToken(refreshToken: string): Promise<string>;
  
}