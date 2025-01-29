import mongoose, { Document } from 'mongoose';

export interface IManager extends Document {
  personalDetails: {
    managerName: string;
    personalWebsite?: string;
    email: string;
    profilePicture?: string;
    phone: string;
  };
  professionalDetails: {
    managerType: "HumanResourceManager" | "GeneralManager" | "ProjectManager" | "SalesManager";
    workTime: "Full-Time" | "Part-Time" | "Contract" | "Temporary";
    joiningDate?: Date;
    designation?: string;
    salary: number;
  };
  address: {
    street?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
  companyDetails: {
    companyName: string;
    companyLogo?: string;
    companyRegistrationNumber: string;
    companyWebsite?: string;
  };
  documents: {
    resume: {
      documentName: string;
      documentUrl: string;
      documentSize?: string;
      uploadedAt: Date;
    };
  };
  managerCredentials: {
    companyEmail: string;
    companyPassword: string;
  };
  isActive?: boolean;
  isVerified?: boolean;
  isBlocked?: boolean;
  role?: string;
  businessOwnerId?: mongoose.Schema.Types.ObjectId;
  subscriptionId?: mongoose.Schema.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}
