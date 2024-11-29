import mongoose, { Schema } from 'mongoose';
import IEmployee from '../entities/employeeEntities';


const employeeSchema = new Schema<IEmployee>({
  managerId: { type: mongoose.Schema.Types.ObjectId, ref: 'manager' }, // Corrected reference type
  businessOwnerId: { type: mongoose.Schema.Types.ObjectId, ref: 'BusinessOwner' },

  isActive: { type: Boolean, default: true },
  isVerified: { type: Boolean, default: false },
  isBlocked: { type: Boolean, default: false },
  
  personalDetails: {
    profilePicture:{ type: String ,default: "https://avatar.iran.liara.run/public/boy?username=Ash"},
    employeeName: { type: String },
    email: { type: String, required: true },
    phone: { type: String },
  },
  address:{
    street: { type: String },
    city: { type: String },
    state: { type: String },
    country: { type: String },
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


const Employee = mongoose.model<IEmployee>('Employee', employeeSchema);

export default Employee;

