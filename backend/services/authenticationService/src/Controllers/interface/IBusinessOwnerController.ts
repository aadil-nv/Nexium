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

export interface IBusinessOwner extends Omit<IBusinessOwnerDocument, "_id"> {}

export interface ITokenResponse {
  accessToken: string;
  refreshToken: string;
}

export interface IPaymentIntentResponse {
    clientSecret: string;
  }



  export default interface IBusinessOwnerController {
    register(req: Request, res: Response): Promise<Response>;
    login(req: Request, res: Response): Promise<Response>;
    validateOtp(req: Request, res: Response): Promise<any>;
    resendOtp(req: Request, res: Response): Promise<Response>;
    createCheckoutSession(req: Request, res: Response): Promise<Response>;
    forgotPassword(req: Request, res: Response): Promise<Response>;
    addNewPassword(req: Request, res: Response): Promise<Response>;
  }

