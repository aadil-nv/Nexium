
import { ObjectId } from "mongoose";

export interface ISuperAdmin {
  _id?: ObjectId;
  username?: string;
  email?: string;
  password?: string;
  role?: string;
}

export interface IExtendedLoginResponse {
  token: string;
  refreshToken: string;
  admin: Omit<ISuperAdmin, "password">;
}

export default interface ISuperAdminRepository {
  findByEmail(email: string): Promise<ISuperAdmin | null>;
  create(admin: ISuperAdmin): Promise<ISuperAdmin>;
  findById(id: string): Promise<ISuperAdmin | null>;
}
