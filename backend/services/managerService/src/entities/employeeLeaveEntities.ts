import mongoose, { Schema, Document } from 'mongoose';


export interface IEmployeeLeave extends Document {
    employeeId: string; // Unique identifier for the employee
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
    createdAt?: Date;
    updatedAt?: Date;
  }