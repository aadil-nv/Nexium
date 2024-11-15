import { Document, Types } from "mongoose";

export interface ISubscription {
  subscriptionId: Types.ObjectId;
  startDate: Date;
  endDate: Date;
  status: string;
}

export interface IBusinessOwnerDocument extends Document {
  _id: Types.ObjectId;
  companyName: string;
  businessOwnerName: string;
  email: string;
  address: string;
  password: string;
  phone: string;
  website?: string;
  registrationNumber: string;
  isVerified: boolean;
  isBlocked: boolean;
  role: string;
  documents: {
    documentName: string;
    documentUrl: string;
    uploadedAt: Date;
  }[];
  subscription: ISubscription;
  companyLogo: string;
  profileImage: string; 
}