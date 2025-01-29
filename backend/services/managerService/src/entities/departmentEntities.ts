import mongoose, { Document, mongo } from 'mongoose';

// Define the Employee interface
export interface IEmployee {
  employeeId: mongoose.Types.ObjectId;           // Unique identifier for the employee
  name: string;         // Name of the employee
  email?: string;       // Optional email address of the employee
  position?: string;    // Optional position of the employee
  profilePicture?: string;  // Optional URL or path to the employee's profile picture
  isActive: boolean;    // Whether the employee is active or not
}

// Define the Department interface
export default interface IDepartment extends Document {
  departmentName: string;   // Name of the department
  employees: IEmployee[];    // List of employees in the department
}
