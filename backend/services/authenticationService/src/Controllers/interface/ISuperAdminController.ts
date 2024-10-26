
import { ObjectId } from "mongoose";
import { NextFunction, Request, Response } from "express";


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

export default interface ISuperAdminController {
    adminLogin(req: Request, res: Response, next: NextFunction): Promise<Response | void>;
    adminRegister(req: Request, res: Response): Promise<Response>;
    // refreshAccessToken(req: Request, res: Response): Promise<Response>;
   
}