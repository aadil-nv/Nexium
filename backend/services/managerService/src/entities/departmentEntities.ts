import mongoose, { Document, mongo } from 'mongoose';

export interface IEmployee {
  employeeId: mongoose.Types.ObjectId;           
  name: string;        
  email?: string;      
  position?: string;   
  profilePicture?: string;  
  isActive: boolean;    
}

export default interface IDepartment extends Document {
  departmentName: string;   
  employees: IEmployee[];    
}
