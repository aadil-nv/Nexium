import { Document, Types } from "mongoose";

export interface ISubscription {
  planName: string;
  planType: string;
  startDate: Date;
  endDate: Date;
  status: string;
}

export interface ICompanyDocument extends Document {
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
}

export interface ICompany extends Omit<ICompanyDocument, "_id"> {}

export interface ITokenResponse {
  email?: string;
  success?: boolean;
  message?: string;
  accessToken?: string;
  refreshToken?: string;
  isVerified?: boolean;
}


export interface IPaymentIntentResponse {
  success: boolean;
  message?: string;
  role?: string;
  planId: number;
  session?: any;
  accessToken?: string;
  refreshToken?: string;
  
  }

  export interface IOtpValidationResult {
    success: boolean;
    email?: string;
    accessToken?: string;
    refreshToken?: string;
}

export default interface IBusinessOwnerService {

  login(email: string, password: string): Promise<ITokenResponse>;
  register(companyData: Partial<ICompany>): Promise<{ tokens?: ITokenResponse; message?: string; email?: string }>;
  sendOtp(email: string, otp: string): Promise<void>;
  generateTokens(company: ICompanyDocument): ITokenResponse;
  validateOtp(email: string, otp: string): Promise<any>;
  createCheckoutSession(plan: any,amount: number,currency: string, email: string): Promise<IPaymentIntentResponse>;
  resendOtp(email: string): Promise<{ success: boolean; message: string }>;
  forgotPassword(email: string): Promise<{ success: boolean; message: string; email?: string }>;
  addNewPassword(email: string, password: string): Promise<{ success: boolean; message: string }>;
}