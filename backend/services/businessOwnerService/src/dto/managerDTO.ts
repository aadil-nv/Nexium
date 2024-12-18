export interface ManagerDTO {
    personalDetails: {
      managerName: string;
      personalWebsite?: string;  // Allow undefined
      email: string;
      profilePicture?: string;   // Allow undefined
      phone: string;
    };
    professionalDetails: {
      managerType: string;
      workTime: string;
      joiningDate?: Date;  // Allow undefined
      salary: number;
    };
    address: {
      street: string;
      city: string;
      state: string;
      postalCode: string;
      country: string;
    };
    companyDetails: {
      companyName: string;
      companyLogo?: string;  // Allow undefined
    };
    managerCredentials: {
      companyEmail: string;
      companyPassword: string;
    };
    _id: string;
    isActive: boolean;
    isVerified: boolean;
    isBlocked: boolean;
    businessOwnerId: string;
    createdAt: Date;
    updatedAt: Date;
    documents?: any;  // Add the type for documents
  
  }
  