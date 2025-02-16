import { Document, Types } from "mongoose";
import { IBusinessOwnerDocument ,ISubscription} from "../../entities/businessOwnerEntities";



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
    updateisActive(id: any, isActive: boolean): Promise<IBusinessOwnerDocument | null>
  }
  