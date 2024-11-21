import { Document, Types } from "mongoose";
import { CompanyIncorporationDocType, BusinessOwnerIDProofType } from "../utils/enums";


export interface ISubscription {
    subscriptionId: Types.ObjectId;
    startDate: Date;
    endDate: Date;
    status: "Active" | "Expired" | "Pending";
  }
  
export interface IAddress {
  streetAddress: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface IDocument {
  companyIncorporationDocument: CompanyIncorporationDocType;
  businessOwnerIdProof: BusinessOwnerIDProofType;
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
  address: IAddress;
  isVerified: boolean;
  isBlocked: boolean;
  role: string;
  subscription: ISubscription;
  createdAt: Date;
  updatedAt: Date;
}
