export interface ManagerDTO {
  personalDetails: {
    managerName: string;
    personalWebsite?: string;
    email: string;
    profilePicture?: string;
    phone: string;
  };
  professionalDetails: {
    managerType: "HumanResourceManager" | "GeneralManager" | "ProjectManager" | "SalesManager";
    workTime: "Full-Time" | "Part-Time" | "Contract" | "Temporary";
    joiningDate?: Date;
    designation?: string;
    salary: number;
  };
  address?: {
    street?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
  companyDetails: {
    companyName: string;
    companyLogo?: string;
    companyRegistrationNumber: string;
    companyWebsite?: string;
  };
  documents?: {
    resume: {
      documentName: string;
      documentUrl: string;
      documentSize?: string;
      uploadedAt: Date;
    };
  };
  managerCredentials?: {
    companyEmail: string;
    companyPassword: string;
  };
  isActive?: boolean;
  isVerified?: boolean;
  isBlocked?: boolean;
  businessOwnerId?: string;
  subscriptionId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
