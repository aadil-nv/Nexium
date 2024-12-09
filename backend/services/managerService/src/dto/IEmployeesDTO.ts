export interface IEmployeesDTO {
    employeeName: string;
    position: string;
    isActive: boolean;
    profilePicture: string;
    _id: string
    email: string
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
    documentSize: number; // Size of the document in bytes
    uploadedAt: Date;
  }
  
export interface IEmployeeDocumentsDTO {
    resume: IDocumentDTO;
    employeeIdProof: IDocumentDTO;
  }