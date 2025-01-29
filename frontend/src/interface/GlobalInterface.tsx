


export interface ICardProps {
    planId: string;
    planName: string;
    description: string;
    price: number;
    planType: string;
    featuresString?: string;  // Optional, for backward compatibility

    durationInMonths: number;
    features: string[];
    isActive: boolean;
    onStatusChange: (newStatus: boolean) => void;
    onPlanUpdate: (updatedPlan: ICardProps) => void;
  }

  export interface ICardImageProps {
    title: string;
    imgSrc: string;
    onImageChange: (updatedImageUrl: string) => void; // Added the callback function type
  }
  


 export  interface IEmployee {
    employeeId?: string;
    name: string;
    email: string;
    position: string;
    isOnline: boolean;
    profilePicture: string;
  }
  
export  interface IDepartmentCardProps {
    departmentName: string;
    employees: IEmployee[];
    themeColor: string;
    onEditEmployee?: (id: string) => void;
    onRemoveEmployee: (id: string) => void;
    onRemoveDepartment: () => void;
    departmentId: string;
  }  

export  interface IDropdownMenuProps {
    themeColor: string;
    onLogoutClick: () => void;
    onProfileClick: () => void;
    onSettingsClick: () => void;
    onOptionSelect: () => void;
  }

    