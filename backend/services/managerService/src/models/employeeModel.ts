import mongoose, { Schema } from 'mongoose';
import IEmployee from '../entities/employeeEntities';

const employeeSchema = new Schema<IEmployee>({
  managerId: { type: mongoose.Schema.Types.ObjectId, ref: 'manager' }, // Corrected reference type
  name: { type: String },
  isActive: { type: Boolean, default: true },
  isVerified: { type: Boolean, default: false },
  isBlocked: { type: Boolean, default: false },
  profilePicture:{ type: String ,default: "https://avatar.iran.liara.run/public/boy?username=Ash"},
  
  personalDetails: {
    firstName: { type: String },
    lastName: { type: String },
    email: { type: String, required: true }, // Ensure email is required
    phone: { type: String },
    street: { type: String },
    city: { type: String },
    state: { type: String },
    zipCode: { type: String },
  },
  
  professionalDetails: {
    position: { type: String, enum: ["Team Lead", "Senior Software Engineer", "Junior Software Engineer"] },
    workTime: { type: String, enum: ["Full-Time", "Part-Time", "Contract", "Temporary"] },
    department: { type: String },
    joiningDate: { type: Date },
    currentStatus: { type: String },
    companyName: { type: String },
    salary: { type: Number },
  },
  
  employeeCredentials: {
    companyEmail: { type: String, required: true, unique: true }, // Ensure uniqueness
    companyPassword: { type: String },
  },

  documents: {
    resume: { type: String },
    idProof: { type: String },
  },
});

// Create the Employee model based on the schema
const Employee = mongoose.model<IEmployee>('Employee', employeeSchema);

export default Employee;
