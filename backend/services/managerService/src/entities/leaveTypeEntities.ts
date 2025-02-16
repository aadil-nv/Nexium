
import mongoose, { Schema, Document } from 'mongoose';


export interface ILeaveType extends Document {
  businessOwnerId: mongoose.Schema.Types.ObjectId;
    sickLeave: number;
    casualLeave: number;
    maternityLeave: number;
    paternityLeave: number;
    paidLeave: number;
    unpaidLeave: number;
    compensatoryLeave: number;
    bereavementLeave: number;
    marriageLeave: number;
    studyLeave: number;
  }