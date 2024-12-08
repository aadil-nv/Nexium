import { Types } from "mongoose";

export interface ISubscriptionDTO {
    _id:Types.ObjectId;
    planName: string;
    description: string;
    price: number;
    planType: "Trial" | "Basic" | "Premium" ; 
    durationInMonths: number;
    features: string[]; 
    isActive: boolean; 
}

export interface UpgradePlanResponseDTO {
    sessionId: string | null;
    success: boolean;
    planName: string;
  }
  
  export interface ProcessPaidPlanDTO {
    session: any;
    success: boolean;
    planName: string;
  }
  
  export interface HandleWebhookResponseDTO {
    success: boolean;
    updatedBusinessOwner: any;
  }