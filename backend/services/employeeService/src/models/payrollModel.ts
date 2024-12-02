import { Schema, model, Document } from 'mongoose';
import {IPayroll} from '../entities/payrollEntities';

const payrollSchema = new Schema<IPayroll>({
  employeeId: { type: Schema.Types.ObjectId, ref: 'Employee', required: true },
  payroll: [{
    month: { type: String, required: true },
    year: { type: Number, required: true },
    salary: { type: Number, required: true },
    bonuses: { type: Number, default: 0 },
    deductions: { type: Number, default: 0 },
    grossSalary: { type: Number, required: true },
    netSalary: { type: Number, required: true },
    payDate: { type: Date, required: true },
    paymentStatus: { type: String, enum: ['Paid', 'Pending', 'Failed'], required: true },
    paymentMethod: { type: String, enum: ['Bank Transfer', 'Cash', 'Cheque'], required: true },
    taxInfo: {
      taxRate: { type: Number, required: true },
      taxAmount: { type: Number, required: true },
    },
  }],
}, {
  timestamps: true,
});

const Payroll = model<IPayroll>('Payroll', payrollSchema);

export default Payroll;
