
import{ Document, Types } from "mongoose";
export  default interface ISubscription extends Document {
    _id:Types.ObjectId;
    planName: string;
    description: string;
    price: number;
    planType: "Trial" | "Basic" | "Premium" ; 
    durationInMonths: number;
    features: string[]; 
    isActive: boolean; 
  }