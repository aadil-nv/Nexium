import { Document, Types } from "mongoose";
import {  Request, Response } from "express";

export interface ISubscription {
  planName: string;
  planType: string;
  startDate: Date;
  endDate: Date;
  status: string;
}

export interface IBusinessOwnerDocument extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  address: string;
  password: string;
  phone: string;
  website?: string;
  registrationNumber: string;
  isVerified: boolean;
  role: string;
  documents: {
    documentName: string;
    documentUrl: string;
    uploadedAt: Date;
  }[];
  subscription: ISubscription;
  companyLogo: string;
  profileImag: string; 
}