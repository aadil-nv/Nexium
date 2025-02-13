export interface Employee {
    _id: string;
    managerId: string;
    businessOwnerId: string;
    isActive: boolean;
    isVerified: boolean;
    isBlocked: boolean;
    role: string;
    personalDetails: {
      employeeName: string;
      email: string;
      phone: string;
      profilePicture: string;
      personalWebsite: string;
      bankAccountNumber: string;
      ifscCode: string;
      aadharNumber: string;
      panNumber: string;
      gender: "Male" | "Female" | "Other";
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
      department: string | null;
      workTime: "Full-Time" | "Part-Time" | "Contract" | "Temporary";
      joiningDate: Date;
      currentStatus: string;
      salary: number;
      uanNumber: string;
      pfAccount: string;
      esiAccount: string;
    };
    employeeCredentials: {
      companyEmail: string;
      companyPassword: string;
    };
  }