import { Document, Types } from "mongoose";


export interface ISubscription {
    subscriptionId: Types.ObjectId;
    customerId: string;
    startDate: Date;
    endDate: Date;
    status: "Active" | "Expired" | "Pending";
  }
  
export interface IAddress {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface IDocument {
  documentName: string;
  documentUrl: string;
  documentSize: string;
  uploadedAt: Date;
}

export interface IDocuments {
  companyCertificate: IDocument;  
}


export interface IPersonalDetails {
  businessOwnerName: string;
  email: string;
  password: string;
  phone: string;
  personalWebsite?: string;
  profilePicture?: string;
}

export interface ICompanyDetails {
  companyName: string;
  companyLogo?: string;
  companyRegistrationNumber: string;
  companyEmail: string;
  companyWebsite?: string;
 
}

export interface IBusinessOwnerDocument extends Document {  // <-- Ensure this extends `Document`
  _id: Types.ObjectId;
  personalDetails: IPersonalDetails;
  companyDetails: ICompanyDetails;
  documents: IDocuments;
  address: IAddress;
  isVerified: boolean;
  isBlocked: boolean;
  role: string;
  subscription: ISubscription;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

