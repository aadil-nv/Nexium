import { Document } from "mongoose";
import { Request, Response } from "express";

export interface IManagerDocument extends Document {
  name: string;
  email: string;
  position: string;
  phone: string;
  employeeId: string;
  salary: number;
  workTime: string;  // e.g., "full-time", "part-time"
  joiningDate: Date;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  documents: {
    documentName: string;
    documentUrl: string;
    uploadedAt: Date;
  }[];
  isActive: boolean;
  isVerified: boolean;
  companyCredentials: {
    companyName: string;
    companyRegistrationNumber: string;
    email: string;
    password: string;
  };
}


export default interface IManagerController {
  getProfile(req: any, res: any): Promise<any>;
  getAllManagers(req:  Request ,res:Response): Promise<any>;
  addManagers(req: any, res: any): Promise<any>;
}