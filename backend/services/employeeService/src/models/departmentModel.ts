import mongoose, { Document, mongo, Schema } from 'mongoose';
import IDepartment from '../entities/departmentEntities';

// Employee Schema
const employeeSchema: Schema = new Schema({
  _id: { 
    type: mongoose.Schema.Types.ObjectId,ref: 'Employee', 
    required: true,  // Ensure id is required and a string
  },
  name: { 
    type: String, 
    required: true, 
    trim: true,  // Automatically trim any leading/trailing spaces from name
    validate: {
      validator: (v: string) => v.length > 0,  // Ensure name is not an empty string
      message: 'Employee name cannot be empty.'
    }
  },
  email: { 
    type: String, 
    required: false 
  },
  position: { 
    type: String, 
    required: false 
  },
  profilePicture: { 
    type: String,
    default: "https://cdn.pixabay.com/photo/2018/08/28/12/41/avatar-3637425_1280.png", 
    required: false, 
  },
  isActive: { 
    type: Boolean, 
    required: true,  // Whether the employee is active or not
    default: true     // Default value to true (active)
  }
});

// Department Schema
const departmentSchema: Schema = new Schema({
  departmentName: { 
    type: String, 
    required: true,  // Ensure departmentName is required
    trim: true       // Automatically trim any leading/trailing spaces from departmentName
  },
  employees: { 
    type: [employeeSchema], 
    required: true,  // Ensure the employees array is required
    validate: {
      validator: (v: any[]) => v.length > 0,  // Ensure that the employees array is not empty
      message: 'A department must have at least one employee.'
    }
  },
});

// Department Model
const Department = mongoose.model<IDepartment & Document>('Department', departmentSchema);

export default Department;