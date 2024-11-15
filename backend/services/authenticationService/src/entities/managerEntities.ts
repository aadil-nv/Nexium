
import { Document } from "mongoose";

export default interface IManager extends Document {
  name: string;
  email: string;
  managerType:"HumanResourceManager" |"GeneralManager" |"ProjectManager" | "SalesManager";
  phone: string;
  employeeId: string;
  salary: number;
  workTime: "Full-Time" | "Part-Time" | "Contract" | "Temporary";  // Enum for workTime
  joiningDate: Date;
  subscriptionId?:string;
  profilePicture: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  documents: {
    documentName: string;
    documentUrl: string;
    uploadedAt: Date;
  }[];
  isActive: boolean;
  isVerified: boolean;
  isBlocked: boolean;
  managerCredentials: {
    companyName: string;
    companyRegistrationNumber: string;
    email: string;
    password: string;
  };
  businessOwnerId?: string;  
}
