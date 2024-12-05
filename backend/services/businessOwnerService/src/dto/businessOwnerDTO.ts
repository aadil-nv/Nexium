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
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  }

  export interface IDocumentsDTO {
    documentName: string;
    documentUrl: string;
    documentSize: string;
    uploadedAt: Date;       // Refers to the business owner's ID proof
  }


  
  export interface IResponseDTO{
    success?: boolean;
    message?: string;
    data?: any;
    subscription?: string;
    accessToken?:string;
  }


  export interface IDocumentDTO {
      documentName: String;
      documentUrl: String;
      documentSize: String;
      uploadedAt: Date;

    }

 