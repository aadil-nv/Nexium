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