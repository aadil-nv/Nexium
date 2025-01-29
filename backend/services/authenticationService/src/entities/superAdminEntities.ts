import { ObjectId } from "mongoose";

export interface ISuperAdmin {
    _id: ObjectId;
    username: string;
    email: string;
    password?: string;
    role?: string;
  }