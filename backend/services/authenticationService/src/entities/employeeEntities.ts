
import mongoose from "mongoose";
export default interface IEmployee {
    employeeId: string;
    employeeName: string;
    attendance: string;
    date: Date;
}

export default interface IEmployeeDocument extends mongoose.Document {
    hriId: string;
    name: string;
    personalDetails: {
      address: string;
      phone: string;
      emergencyContact: string;
      bloodGroup: string;
      maritalStatus: string;
    };
    professionalDetails: {
      designation: string;
      department: string;
      jobDescription: string;
      experience: number;
      skills: string[];
    };
    accountAccess: {
      companyEmail: string;
      password: string;
    };
    documents: {
      documentType: string;
      documentName: string;
      documentPath: string;
    }[];
    isActive: boolean;
    isVerified: boolean;
    joiningDate: Date;
    role: string;
  }