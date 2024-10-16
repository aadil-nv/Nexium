import { ObjectId } from "mongoose";

export interface IAdmin {
  _id: ObjectId;
  username: string;
  email: string;
  password: string;
  role: string;
}

export interface IExtendedLoginResponse {
  token: string;
  refreshToken: string;
  admin: Omit<IAdmin, "password">;
}
