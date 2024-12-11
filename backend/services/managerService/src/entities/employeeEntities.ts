import mongoose, { Schema, Document } from 'mongoose';

export default interface IEmployee extends Document {
  managerId: mongoose.Schema.Types.ObjectId; // Correct reference to HR
  businessOwnerId: mongoose.Schema.Types.ObjectId;
  isActive: boolean;
  isVerified: boolean;
  isBlocked: boolean;

  personalDetails: {
    employeeName: string;
    email: string;
    phone: string;
    profilePicture:string
   
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
    department: mongoose.Schema.Types.ObjectId;
    workTime: "Full-Time" | "Part-Time" | "Contract" | "Temporary";
    joiningDate: Date;
    currentStatus: string;
    companyName: string;
    salary: number;
    skills: string[];
    
  };
  employeeCredentials: {
    companyEmail: string;
    companyPassword: string;
  };
  documents: {
  resume: {
    documentName: string;
    documentUrl: string;
    documentSize: number; // Size of the document in bytes
    uploadedAt: Date;
  };
  idProof: {
    documentName: string;
    documentUrl: string;
    documentSize: number; // Size of the document in bytes
    uploadedAt: Date;
  };
};


  leaves: {
    casualLeave: number;
    sickLeave: number;
    paidLeave: number;
    unpaidLeave: number;
  };
}