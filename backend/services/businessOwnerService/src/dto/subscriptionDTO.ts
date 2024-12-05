import { Types } from "mongoose";

export interface ISubscriptionDTO {
    _id?: Types.ObjectId;
    subscriptionName: string;
    subscriptiondescription: string;
    subscriptionPrice: number;
    subscriptionPlanType: "Trial" | "Basic" | "Premium" ; 
    durationInMonths: number;
    features: string[]; 
    isActive: boolean; 
}