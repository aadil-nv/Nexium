import mongoose, { Schema, Document } from "mongoose";
import { IEmployeePayroll } from "../entities/payrollEntities";


const EmployeePayrollSchema = new Schema<IEmployeePayroll>({
  employeeDetails: {
    employeeId: { type: String, required: true },
    employeeName: { type: String, required: true },
    bankAccount: { type: String, required: true },
    bankIfsc: { type: String, required: true },
    pfAccount: { type: String, required: true },
    esiAccount: { type: String, required: true },
    uanNumber: { type: String, required: true }
  },
  payrollDetails: {
    payDate: { type: Date, required: true },
    month: { type: String, required: true },
    year: { type: String, required: true },
    basicSalary: { type: Number, required: true },
    grossSalary: { type: Number, required: true },
    monthlyWorkingDays: { type: Number, required: true },
    totalMinutesRequiredForTheMonth: { type: Number, required: true },
    totalWorkedMinutes: { type: Number, required: true },
    totalPresentDays: { type: Number, required: true },
    totalAbsentDays: { type: Number, required: true },
    totalApprovedLeaves: { type: Number, required: true },
    approvedLeaveDaysMinutes: { type: Number, required: true },
    preApprovedLeavesPaidMinutes: { type: Number, required: true },
    incentiveAmount: { type: Number, required: true },
    bonusPayable: { type: Number, required: true },
    totalDeductions: { type: Number, required: true },
    pf: { type: Number, required: true },
    professionalTax: { type: Number, required: true },
    esiFund: { type: Number, required: true },
    netSalary: { type: Number, required: true },
    paymentStatus: { type: String, enum: ['Paid', 'Pending', 'Failed'], required: true },
    paymentMethod: { type: String, enum: ['Bank Transfer', 'Cash', 'Cheque'], required: true }
  }
}, { timestamps: true });

// Create and export the EmployeePayroll model
const EmployeePayroll = mongoose.model<IEmployeePayroll>("EmployeePayroll", EmployeePayrollSchema);
export default EmployeePayroll;
