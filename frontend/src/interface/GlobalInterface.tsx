


export interface ICardProps {
    planId: string;
    planName: string;
    description: string;
    price: number;
    planType: string;
    durationInMonths: number;
    features: string[];
    isActive: boolean;
    onStatusChange: (newStatus: boolean) => void;
    onPlanUpdate: (updatedPlan: any) => void;
  }

export interface ICardImageProps {
    title: string;
    imgSrc: string;
  }


 export  interface IEmployee {
    id: string;
    photo: string;
    name: string;
    email: string;
    position: string;
    isOnline: boolean;
  }
  
export  interface IDepartmentCardProps {
    departmentName: string;
    employees: IEmployee[];
    themeColor: string;
    onEditEmployee: (id: string) => void;
    onRemoveEmployee: (id: string) => void;
    onRemoveDepartment: () => void;
    departmentId: string;
  }  

export  interface IDropdownMenuProps {
    themeColor: string;
    onLogoutClick: () => void;
    onProfileClick: () => void;
    onSettingsClick: () => void;
  }

    