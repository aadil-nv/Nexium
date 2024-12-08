

export interface IEmployee {  //! Part of Department 
    id?: string;
    photo?: string;
    name?: string;
    email?: string;
    position?: string;
    isOnline?: boolean;
    profilePicture?: string;
    isActive?: boolean;
  }

export interface IDepartment {
    _id: string;
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
  }

  