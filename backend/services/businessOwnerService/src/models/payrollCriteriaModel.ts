import mongoose, { Schema, Document } from 'mongoose';
import { IPayrollCriteria } from '../entities/payrollCriteriaEntities';

// Define the schema for PayrollCriteria
const PayrollCriteriaSchema: Schema<IPayrollCriteria> = new Schema<IPayrollCriteria>({
  businessOwnerId: { type: mongoose.Schema.Types.ObjectId, ref: 'BusinessOwner', required: true },

  allowances: {
    bonus: { type: Number, default: 0 },
    gratuity: { type: Number, default: 0 },
    medicalAllowance: { type: Number, default: 0 },
    hra: { type: Number, default: 0 },
    da: { type: Number, default: 0 },
    ta: { type: Number, default: 0 },
    overTime: {
      type: { 
        type: Number, 
        default: 0 
      },
      overtimeEnabled: { 
        type: Boolean, 
        default: false // Default to false
      },
    },
  },
  deductions: {
    incomeTax: { type: Number, default: 0 },
    providentFund: { type: Number, default: 0 },
    professionalTax: { type: Number, default: 0 },
    esiFund: { type: Number, default: 0 },
  },
  incentives: [{
    incentiveName: { type: String },
    minTaskCount: { type: Number },
    maxTaskCount: { type: Number },
    percentage: { type: Number },
  }],
  payDay: { type: Number, default: 5 },
  createdAt: { type: Date, default: Date.now },
});

// Define and export the model
const PayrollCriteria = mongoose.model<IPayrollCriteria>('PayrollCriteria', PayrollCriteriaSchema);

export default PayrollCriteria;
