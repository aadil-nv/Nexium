export interface IPayrollDTO {
  employeeId: any;
  message: string;
  success: boolean;

  companyName?: string;
  payroll: Array<{
    payDate: Date;
    month: string;
    year: string;
    basicSalary: number;
    grossSalary: number;
    monthlyWorkingDays: number;
    totalMinutesRequiredForTheMonth: number;
    totalWorkedMinutes: number;
    totalPresentDays: number;
    totalAbsentDays: number;
    totalApprovedLeaves: number;
    approvedLeaveDaysMinutes: number;
    preApprovedLeavesPaidMinutes: number;
    incentiveAmount: number;
    bonusPayable: number;
    totalDeductions: number;
    pf: number;
    professionalTax: number;
    esiFund: number;
    netSalary: number;
    paymentStatus: any; // Enum for payment status
    paymentMethod: any; // Enum for payment method
    employeeName: string;
    bankAccount: any;
    pfAccount: any;
    esiAccount: any;
    uanNumber: any;
    bankIfsc: any;
    _id?: any; // Optional ID for reference
  }>;
}

export interface IGetPayRollDTO {
  employeeId: any;
  message?: string;
  success?: boolean;

  companyName?: string;
  payroll: Array<{
    payDate: Date;
  month: string;
  year: string;
  totalWorkedMinutes: number;
  totalPresentDays: number;
  totalAbsentDays: number;
  netSalary: number;
  paymentStatus: string;
  paymentMethod: string;
  employeeName: string;
  _id: any;
  }>;
}