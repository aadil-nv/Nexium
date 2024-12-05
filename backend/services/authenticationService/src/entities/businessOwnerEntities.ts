import { Document, Types } from "mongoose";
import { CompanyIncorporationDocType, BusinessOwnerIDProofType } from "../utils/enums";


export interface ISubscription {
    subscriptionId: Types.ObjectId;
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
  documentSize: number;
  uploadedAt: Date;
}

export interface IDocuments {
  companyCertificate: IDocument[];  // Array of company certificate documents
  businessOwnerId: IDocument[];     // Array of business owner ID documents
}

export interface IPersonalDetails {
  businessOwnerName: string;
  email: string;
  password: string;
  phone: string;
  personalWebsite?: string;
  profileImage?: string;
}

export interface ICompanyDetails {
  companyName: string;
  companyLogo?: string;
  companyRegistrationNumber: string;
  companyEmail: string;
  companyWebsite?: string;
  documents: IDocument;
}

export interface IBusinessOwnerDocument extends Document {  // <-- Ensure this extends `Document`
  _id: Types.ObjectId;
  personalDetails: IPersonalDetails;
  companyDetails: ICompanyDetails;
  documents: IDocuments[];
  address: IAddress;
  isVerified: boolean;
  isBlocked: boolean;
  role: string;
  subscription: ISubscription;
  createdAt: Date;
  updatedAt: Date;
}
