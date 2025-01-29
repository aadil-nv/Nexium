import mongoose, { Schema, Document } from 'mongoose';
import { IEmployeeLeave } from '../entities/employeeLeaveEntities';


const employeeLeaveSchema = new Schema<IEmployeeLeave>(
  {
    employeeId: { type: String},
    sickLeave: { type: Number },
    casualLeave: { type: Number },
    maternityLeave: { type: Number },
    paternityLeave: { type: Number },
    paidLeave: { type: Number },
    unpaidLeave: { type: Number},
    compensatoryLeave: { type: Number},
    bereavementLeave: { type: Number},
    marriageLeave: { type: Number},
    studyLeave: { type: Number },
  },
  {
    timestamps: true, 
  }
);

const EmployeeLeave = mongoose.model<IEmployeeLeave>('EmployeeLeave', employeeLeaveSchema);

export default EmployeeLeave;
export { IEmployeeLeave };
