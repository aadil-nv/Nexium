import { Schema, model, Document } from 'mongoose';
import { IPayroll } from '../entities/payrollEntities';

const payrollSchema = new Schema<IPayroll>({
  employeeId: { type: Schema.Types.ObjectId, ref: 'Employee',  },
  payroll: [{
    month: { type: String,  },
    year: { type: Number,  },
    salary: { type: Number,  },
    bonuses: { type: Number, default: 0 },
    deductions: { type: Number, default: 0 },
    grossSalary: { type: Number,  },
    netSalary: { type: Number,  },
    payDate: { type: Date,  },
    paymentStatus: { type: String, enum: ['Paid', 'Pending', 'Failed'],  },
    paymentMethod: { type: String, enum: ['Bank Transfer', 'Cash', 'Cheque'],  },
    taxInfo: {
      taxRate: { type: Number,  },
      taxAmount: { type: Number,  },
    },
    totalWorkedMinutes: { type: Number, default: 0 },
    totalPresentDays: { type: Number, default: 0 },
    totalApprovedLeaves: { type: Number, default: 0 },
    totalAbsentDays: { type: Number, default: 0 },
    basicSalary: { type: Number, default: 0 },
    pf: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    otherDeductions: { type: Number, default: 0 },
    totalDeductions: { type: Number, default: 0 },
    bankAccount: { type: String, default: '' },
    employeeName: { type: String, default: '' },
  }],
}, {
  timestamps: true,
});

const Payroll = model<IPayroll>('Payroll', payrollSchema);

export default Payroll;
