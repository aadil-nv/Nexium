import mongoose, { Schema, Document } from 'mongoose';

export default interface IEmployee extends Document {
  managerId: mongoose.Schema.Types.ObjectId; // Correct reference to HR
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
    zipCode:  String ,
  }
  professionalDetails: {
    position: "Team Lead" | "Senior Software Engineer" | "Junior Software Engineer" ;
    department: string;
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
    resume: string;
    idProof: string;
  };
}