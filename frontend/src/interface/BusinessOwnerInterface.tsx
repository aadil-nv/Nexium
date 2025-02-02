export interface BusinessOwner {
  totalEmployees: number;
  activeEmployees: number;
  totalManagers: number;
  activeManagers: number;
  employeeMonthCounts: Record<string, number>;
  managerMonthCounts: Record<string, number>;
}
export interface DashboardData {
  businessOwners: BusinessOwner;
}

export interface StatCardProps {
    icon: React.ReactNode;
    title: string;
    value: number | undefined;
    bgColor: string;
  }

export interface ChartContainerProps {
    children: React.ReactNode;
  }

export  interface Manager {
    _id: string;
    personalDetails: {
      managerName: string;
      email: string;
      profilePicture?: string;
    };
    role: string;
    isActive: boolean;
    isBlocked: boolean;
    isVerified: boolean;
    success?: boolean;
  }

export interface Invoice {
  id: string;
  created: number;
  amount_paid: number;
  amount_due: number;
  invoice_pdf: string;
}

export interface DemoTableProps {
  invoiceData?: Invoice[];
}  