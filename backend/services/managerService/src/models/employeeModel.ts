import mongoose, { Schema } from 'mongoose';
import IEmployee from '../entities/employeeEntities';


const employeeSchema = new Schema<IEmployee>({
  managerId: { type: mongoose.Schema.Types.ObjectId, ref: 'manager' }, // Corrected reference type
  businessOwnerId: { type: mongoose.Schema.Types.ObjectId, ref: 'BusinessOwner' },

  isActive: { type: Boolean, default: true },
  isVerified: { type: Boolean, default: false },
  isBlocked: { type: Boolean, default: false },
  role: { type: String, default: 'employee' },
  
  personalDetails: {
    profilePicture:{ type: String },
    employeeName: { type: String },
    email: { type: String, required: true },
    phone: { type: String },
    personalWebsite: { type: String },
    bankAccountNumber: { type: String },
    ifscCode: { type: String },
    aadharNumber: { type: String },
    panNumber: { type: String },
    gender: { type: String, enum: ['Male', 'Female', 'Other'] },
  },
  address:{
    street: { type: String },
    city: { type: String },
    state: { type: String },
    country: { type: String },
    postalCode: { type: String },
  },
  
  professionalDetails: {
    position: { type: String, enum: ["Team Lead", "Senior Software Engineer", "Junior Software Engineer"] },
    workTime: { type: String, enum: ["Full-Time", "Part-Time", "Contract", "Temporary"] },
    department: { type: String },
    joiningDate: { type: Date },
    currentStatus: { type: String },
    companyName: { type: String },
    companyLogo: { type: String},
    salary: { type: Number },
    uanNumber: { type: String },
    pfAccount: { type: String },
    esiAccount: { type: String },
  },
  
  employeeCredentials: {
    companyEmail: { type: String, required: true, unique: true }, // Ensure uniqueness
    companyPassword: { type: String },
  },

  documents: {
    resume: {
      documentName: { type: String },
      documentUrl: { type: String },
      documentSize: { type: Number },
      uploadedAt: { type: Date, },
    },
  },
  
});


const Employee = mongoose.model<IEmployee>('Employee', employeeSchema);

export default Employee;
