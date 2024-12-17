import mongoose, { Document, mongo } from 'mongoose';

export interface IEmployee {
  _id: mongoose.Types.ObjectId;          
  name: string;         
  email?: string;      
  position?: string;   
  profilePicture?: string; 
  isActive: boolean;  
}

// Define the Department interface
export default interface IDepartment extends Document {
    _id: mongoose.Types.ObjectId;
  departmentName: string; 
  employees: IEmployee[];  
}
