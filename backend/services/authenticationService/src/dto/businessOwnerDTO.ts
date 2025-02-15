import { Document, Types } from "mongoose";




  export interface ISubscription {
  
    subscriptionId:Types.ObjectId;
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
    role: string;
    documents: {
      documentName: string;
      documentUrl: string;
      uploadedAt: Date;
    }[];
    subscription: ISubscription; 
  }
  
  export interface IBusinessOwner extends Omit<IBusinessOwnerDocument, "_id"> {}
  
  export interface ITokenResponse {
    id?: string;
    email?: string;
    name?: string;
    success?: boolean;
    message?: string;
    accessToken?: string;
    refreshToken?: string;
    isVerified?: boolean;
    companyName?:string
    profilePicture?:string;
    companyLogo?:string;
    businessOwnerData?:any
  }
  
  
  export interface IPaymentIntentResponse {
    success: boolean;
    message?: string;
    role?: string;
    planName?: string;
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
  