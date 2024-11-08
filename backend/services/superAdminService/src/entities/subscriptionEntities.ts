
import{ Document } from "mongoose";
export  default interface ISubscription extends Document {
    planName: string;
    description: string;
    price: number;
    planType: "Trial" | "Basic" | "Premium" ; 
    durationInMonths: number;
    features: string[]; 
    isActive: boolean; 
  }