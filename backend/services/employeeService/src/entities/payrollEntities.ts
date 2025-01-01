import { Document, Schema } from "mongoose";

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
    totalWorkedMinutes?: number;  // Total worked minutes (optional)
    totalPresentDays?: number;    // Total present days (optional)
    totalApprovedLeaves?: number;  // Total approved leaves (optional)
    totalAbsentDays?: number;     // Total absent days (optional)
    basicSalary?: number;        // Basic salary (optional)
    pf?: number;                 // Provident fund (optional)
    tax?: number;                // Tax (optional)
    otherDeductions?: number;    // Other deductions (optional)
    totalDeductions?: number;    // Total deductions (optional)
    bankAccount?: string;        // Bank account (optional)
    bankBranch?: string;         // Bank branch (optional)
    employeeName?: string;       // Employee name (optional)
    _id?: Schema.Types.ObjectId ;
  }>;
}
