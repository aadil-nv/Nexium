import { Document, Schema } from "mongoose";

interface IEmployeeDetails {
  employeeId: string;
  employeeName: string;
  bankAccount: string;
  bankIfsc: string;
  pfAccount: string;
  esiAccount: string;
  uanNumber: string;
}

interface IPayrollDetails {
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
  paymentStatus: string; // Enum: 'Paid', 'Pending', 'Failed'
  paymentMethod: string; // Enum: 'Bank Transfer', 'Cash', 'Cheque'
}

export interface IEmployeePayroll extends Document {
  employeeDetails: IEmployeeDetails;
  payrollDetails: IPayrollDetails;
}
