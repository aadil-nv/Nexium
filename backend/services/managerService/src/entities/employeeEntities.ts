import mongoose, { Schema, Document } from 'mongoose';

export default interface IEmployee extends Document {
  managerId: mongoose.Schema.Types.ObjectId; // Correct reference to HR
  name: string;
  isActive: boolean;
  isVerified: boolean;
  isBlocked: boolean;
  profilePicture:string
  personalDetails: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
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