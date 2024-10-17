// src/entities/adminEntity.ts
import { ObjectId } from "mongoose";

export interface ISuperAdmin {
  _id: ObjectId;
  username: string;
  email: string;
  password?: string;
  role?: string;
}

export interface IExtendedLoginResponse {
  token: string;
  refreshToken: string;
  admin: Omit<ISuperAdmin, "password">;
}
