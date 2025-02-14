import exp from "constants";

export interface IPersonalDetailsDTO {
    businessOwnerName: string; 
    email: string; 
    phone: string; 
    personalWebsite?: string; 
    profilePicture?: string; 
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

  export interface IDocumentDTO {
    documentName: string;       
    documentUrl: string;       
    documentSize: string;     
    uploadedAt: Date;       
  }

  
  export interface IResponseDTO{
    success?: boolean;
    message?: string;
    data?: any;
    subscription?: string;
    accessToken?:string;
  }

  export interface ProfessionalDetailsDTO {
    managerType: string;
    workTime: string;
    joiningDate: Date;
    salary: number;
  }


 
  export interface ILeaveTypesDTO {
    _id: any;
    sickLeave: number;
    casualLeave: number;
    maternityLeave: number;
    paternityLeave: number;
    paidLeave: number;
    unpaidLeave: number;
    compensatoryLeave: number;
    bereavementLeave: number;
    marriageLeave: number;
    studyLeave: number;
}

export interface ILeaveResonseDTO{
   
  leaveStatus?: string | null
  message?: string
  success?: boolean
}