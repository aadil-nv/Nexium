import { Document, Types } from "mongoose";
import {Request , response} from "express";
// Define the structure of a subscription document
export interface ISubscription {
  planName: string;  // Name of the subscription plan
  planType: string;  // Type of subscription (e.g., free, premium)
  startDate: Date;   // Subscription start date
  endDate: Date;     // Subscription end date
  status: string;    // Status of the subscription (e.g., active, inactive)
}

// Define the structure of a company document
export interface ICompany extends Document {
  _id: Types.ObjectId; 
  name: string;        
  email: string;      
  address: string;    
  password: string;    
  phone: string;      
  website?: string;    // (Optional) Website URL of the company
  registrationNumber: string; // Company registration number
  isVerified: boolean;  // Verification status of the company
  role: string;         // Role of the user (e.g., admin, user)
  documents: {
    documentName: string; // Name of the uploaded document
    documentUrl: string;  // URL where the document is stored
    uploadedAt: Date;     // Date the document was uploaded
  }[]; 
  subscription: ISubscription; // Subscription details
}


export default interface ISuperAdminRepository {
  getAllCompanies(): Promise<any>;

}
