import mongoose, { Schema, Document } from 'mongoose';

export default interface IEmployee extends Document {
  managerId: mongoose.Schema.Types.ObjectId; // Correct reference to HR
  businessOwnerId: mongoose.Schema.Types.ObjectId;
  isActive: boolean;
  isVerified: boolean;
  isBlocked: boolean;
  role: string;
  personalDetails: {
    employeeName: string;
    email: string;
    phone: string;
    profilePicture:string
    personalWebsite: string;
    bankAccountNumber: string;
    ifscCode: string;
    aadharNumber: string;
    panNumber: string;
    gender: "Male" | "Female" | "Other";
  };
  address:{
    street: String ,
    city:  String ,
    state:  String ,
    country:  String ,
    postalCode:  String ,
  }
  professionalDetails: {
    position: "Team Lead" | "Senior Software Engineer" | "Junior Software Engineer" ;
    department: string | null;
    workTime: "Full-Time" | "Part-Time" | "Contract" | "Temporary";
    joiningDate: Date;
    currentStatus: string;
    companyName: string;
    comapanyLogo: string;
    salary: number;
    uanNumber: string;
    pfAccount: string;
    esiAccount: string;
  
  };
  employeeCredentials: {
    companyEmail: string;
    companyPassword: string;
  };

  documents: {
    resume: {
      documentName: string;
      documentUrl: string;
      documentSize?: string
      uploadedAt: Date;
    };
  };

  
}