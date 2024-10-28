import { Document } from "mongoose";

export interface IManagerDocument extends Document {
  name: string;
  email: string;
  position: string;
  phone: string;
  employeeId: string;
  salary: number;
  workTime: string;  // e.g., "full-time", "part-time"
  joiningDate: Date;
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
  companyCredentials: {
    companyName: string;
    companyRegistrationNumber: string;
    email: string;
    password: string;
  };
}
