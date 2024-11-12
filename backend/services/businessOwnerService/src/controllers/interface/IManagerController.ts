import { Document } from "mongoose";
import { Request, Response } from "express";

export interface IManagerDocument extends Document {
  name: string;
  email: string;
  managerType: string; // Updated to "managerType"
  phone: string;
  employeeId: string;
  salary: number;
  workTime: "Full-Time" | "Part-Time" | "Contract" | "Temporary";  // Enum for workTime
  joiningDate: Date;
  subscriptionId?:string;
  profilePicture: string;
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
  isBlocked: boolean;
  companyCredentials: {
    companyName: string;
    companyRegistrationNumber: string;
    email: string;
    password: string;
  };
  businessOwnerId?: string;  
}

export default interface IManagerController {
  getAllManagers(req: Request, res: Response): Promise<any>;
  addManagers(req: any, res: any): Promise<any>;
}
