import mongoose from "mongoose";

export interface IEmployeesDTO {
    employeeName?: string;
    position?: string;
    isActive?: boolean;
    profilePicture?: string;
    _id?: any
    email?: string
    isBlocked?: boolean
}

export interface IEmployeePersonalInformationDTO {
    employeeName: string;
    email: string;
    phone: string;
    profilePicture:string
}

export interface IEmployeeAddressDTO {
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
}

export interface IEmployeeProfessionalInfoDTO {
    position: string
    department: string;
    workTime: string;
    joiningDate: Date;
    currentStatus: string;
    companyName: string;
    salary: number;
    skills: string[];
}

export interface IEmployeeCredentialsDTO {
    companyEmail: string;
    companyPassword: string;
}

export interface IDocumentDTO {
    documentName: string;
    documentUrl: string;
    documentSize: string; // Size of the document in bytes
    uploadedAt: Date;
  }
  
export interface IEmployeeDocumentsDTO {
    resume: IDocumentDTO;
   
  }

  export interface IEmployeeFullDataDTO {
      _id: string
    managerId: string; // Reference to HR as ObjectId in string format
    businessOwnerId: string; // Reference to Business Owner as ObjectId in string format
    isActive: boolean;
    isVerified: boolean;
    isBlocked: boolean;
  
    personalDetails: {
      employeeName: string;
      email: string;
      phone: string;
      profilePicture: string;
    };
  
    address: {
      street: string;
      city: string;
      state: string;
      country: string;
      postalCode: string;
    };
  
    professionalDetails: {
      position: "Team Lead" | "Senior Software Engineer" | "Junior Software Engineer";
      department?: string | null; 
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
  
  
    leaves: {
      casualLeave: number;
      sickLeave: number;
      paidLeave: number;
      unpaidLeave: number;
    };
  }
  