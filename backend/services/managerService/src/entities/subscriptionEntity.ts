
import{ Document, Types } from "mongoose";
export default interface ISubscription extends Document {
  _id: any;
  planName: string;
  description: string;
  price: number;
  planType: "Trial" | "Basic" | "Premium";
  durationInMonths: number;
  features: string[];
  employeeCount?: number | null;
  managerCount?: number | null;
  projectCount?: number | null;
  serviceRequestCount?: number | null;
  isActive: boolean;
}