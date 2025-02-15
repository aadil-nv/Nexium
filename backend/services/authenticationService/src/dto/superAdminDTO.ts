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