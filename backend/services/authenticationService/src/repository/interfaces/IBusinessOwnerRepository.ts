import { Document, Types } from "mongoose";
import { IBusinessOwnerDocument ,ISubscription} from "../../entities/businessOwnerEntities";

// export interface ISubscription {
//   subscriptionId: Types.ObjectId;
//   startDate: Date;
//   endDate: Date;
//   status: string;
// }

// export interface IBusinessOwnerDocument extends Document {
//   _id: Types.ObjectId;
//   companyName: string;
//   businessOwnerName: string;
//   email: string;
//   address: string;
//   password: string;
//   phone: string;
//   website?: string;
//   registrationNumber: string;
//   isVerified: boolean;
//   role: string;
//   documents: {
//     documentName: string;
//     documentUrl: string;
//     uploadedAt: Date;
//   }[];
//   subscription: ISubscription; 
// }

// export interface IBusinessOwner extends Omit<IBusinessOwnerDocument, "_id"> {}

// export interface ITokenResponse {
//   accessToken: string;
//   refreshToken: string;
// }

export interface IPaymentIntentResponse {
    clientSecret: string;
  }





  export default interface IBusinessOwnerRepository {
    findByEmail(email: string): Promise<IBusinessOwnerDocument | null>;
    create(businessOwnerData: IBusinessOwnerDocument): Promise<IBusinessOwnerDocument>;
    findOtpByEmail(email: string): Promise<any | null>;
    updateVerificationStatus(email: string): Promise<any>;
    updateSubscriptionByEmail(email: string, subscription: ISubscription): Promise<IBusinessOwnerDocument | null>;
    updateOtp(email: string, otp: string): Promise<void>;
    updatePassword(email: string, hashedPassword: string): Promise<void>;
    updateBusinessOwner(businessOwnerId: any, businessOwnerData: Partial<IBusinessOwnerDocument>): Promise<any>;
    findBusinessOwnerById(id: any): Promise<IBusinessOwnerDocument | null>
  }
  