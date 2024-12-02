import exp from "constants";

export interface IPersonalDetailsDTO {
    businessOwnerName: string; 
    email: string; 
    phone: string; 
    personalWebsite?: string; 
    profileImage: string; 
  }
  
  export interface ICompanyDetailsDTO {
    companyName: string; 
    companyLogo?: string; 
    companyRegistrationNumber: string; 
    companyEmail: string; 
    companyWebsite?: string; 
  }

  export interface IAddressDTO {
    streetAddress: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  }

  export interface IDocumentsDTO {
    companyIncorporationDocument: string;  // Refers to the company incorporation document type
    businessOwnerIdProof: string;          // Refers to the business owner's ID proof
  }
  
  export interface IResponseDTO{
    success: boolean;
    message: string;
    data?: any;
  }