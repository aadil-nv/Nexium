import { Document,Schema } from "mongoose";



export interface IPayroll extends Document {

    employeeId: Schema.Types.ObjectId;  // Reference to the employee

    payroll: Array<{
      month: string;  // Month in the format "YYYY-MM"
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
    }>;
  }
  