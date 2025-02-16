import mongoose, { Document } from "mongoose";

// Update the IPayrollCriteria interface to extend Document
export interface IPayrollCriteria extends Document {
  _id: any;
  businessOwnerId: mongoose.Schema.Types.ObjectId;
  allowances: {
    bonus: number;
    gratuity: number;
    medicalAllowance: number;
    hra: number;
    da: number;
    ta: number;
    overTime: {
      type: number;
      overtimeEnabled: boolean;
    };
  };
  deductions: {
    incomeTax: number;
    providentFund: number;
    professionalTax: number;
    esiFund: number;
  };
  incentives: {
    _id: string;
    incentiveName: string;
    minTaskCount: number;
    maxTaskCount: number;
    percentage: number;
  }[];
  payDay:number;
  createdAt: Date;
}
