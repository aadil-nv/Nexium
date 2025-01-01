export interface IPayrollDTO {
    employeeId: string;
    message: string;
    success: boolean;
    payroll: Array<{
      month: string;
      year: number;
      salary: number;
      bonuses: number;
      deductions: number;
      grossSalary: number;
      netSalary: number;
      payDate: Date;
      paymentStatus: 'Paid' | 'Pending' | 'Failed';
      paymentMethod: 'Bank Transfer' | 'Cash' | 'Cheque';
      taxInfo: {
        taxRate: number;
        taxAmount: number;
      };
      totalWorkedMinutes: number;
      totalPresentDays: number;
      totalApprovedLeaves: number;
      totalAbsentDays: number;
      basicSalary: number;
      pf: number;
      tax: number;
      otherDeductions: number;
      totalDeductions: number;
      bankAccount: string;
      employeeName: string;
      _id?:any
    }>;
  }