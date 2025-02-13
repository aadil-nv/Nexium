

export interface IEmployee {  //! Part of Department 

    employeeId?: string;
    photo?: string;
    name?: string;
    email?: string;
    position?: string;
    isOnline?: boolean;
    profilePicture?: string;
    isActive?: boolean;
    isBlocked?: boolean;
    gender?: string;
  }

export interface IDepartment {
    departmentName: string;
    employees: IEmployee[];
    departmentId: string;
    isActive: boolean;
    profilePicture: string;
    email: string;
  }  

  export interface IManagerCardProps {
    image: string;
    name: string;
    email: string;
    onViewDetails: () => void;
    onToggleStatus: () => void; // Changed from onUpdate to onToggleStatus for blocking/unblocking
    isActive: boolean; // New prop to track the active status
    isVerified: boolean; // New prop for verification status
    isBlocked: boolean; // New prop to check if the manager is blocked
    managerId: string;
    onUpdate?: (managerId: string) => void;

  }

  export interface IManagerDetails {
    personalDetails?: {
      managerName?: string;
      email?: string;
      phone?: string;
      personalWebsite?: string;
      profilePicture?: string;
    };
    professionalDetails?: {
      managerType?: string;
      workTime?: string;
      salary?: string;
      joiningDate?: string;
    };
    address?: {
      street?: string;
      city?: string;
      postalCode?: string;
      country?: string;
      state?: string;
    };
    managerCredentials?: {
      companyEmail?: string;
      companyPassword?: string;
    };
  }
  


  export interface IEmployeeData {
    _id: string;
    personalDetails: {
      employeeName: string;
      email: string;
      phone: string;
      profilePicture:string
      personalWebsite: string;
      bankAccountNumber: string;
      ifscCode: string;
      aadharNumber: string;
      panNumber: string;
      gender: string;
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
      department: string;
      workTime: "Full-Time" | "Part-Time" | "Contract" | "Temporary";
      joiningDate: Date;
      currentStatus: string;
      companyName: string;
      salary: number;
      pfAccount: string;
      esiAccount: string;
      uanNumer: string;
    };
    employeeCredentials: {
      companyEmail: string;
      companyPassword: string;
    };
    documents: {
      resume: {
        documentName: string;
        documentUrl: string;
        documentSize: number; // Size of the document in bytes
        uploadedAt: Date;
      };
      employeeIdProof: {
        documentName: string;
        documentUrl: string;
        documentSize: number; // Size of the document in bytes
        uploadedAt: Date;
      };
    };
  }
  
  export interface InfoModalProps {
    visible: boolean;
    onClose: () => void;
    managerId: string;
    managerDetails: IManagerDetails | null;
    onUpdate?: (managerId: string) => void;
  }

  