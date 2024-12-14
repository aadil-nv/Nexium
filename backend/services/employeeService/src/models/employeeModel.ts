import mongoose, { Schema } from 'mongoose';
import IEmployee from '../entities/employeeEntities';


const employeeSchema = new Schema<IEmployee>({
  managerId: { type: mongoose.Schema.Types.ObjectId, ref: 'manager' }, // Corrected reference type
  businessOwnerId: { type: mongoose.Schema.Types.ObjectId, ref: 'BusinessOwner' },

  isActive: { type: Boolean, default: true },
  isVerified: { type: Boolean, default: false },
  isBlocked: { type: Boolean, default: false },
  role:{ type: String, default: "employee" },
  
  personalDetails: {
    profilePicture:{ type: String ,default: "https://avatar.iran.liara.run/public/boy?username=Ash"},
    employeeName: { type: String },
    email: { type: String, required: true },
    phone: { type: String },
    personalWebsite: { type: String },
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
    companyLogo: { type: String,default:"bba3de636181da05d21cf3760f7fca26c1751e50a4186ebd8e8a6cf6887df243"},
    salary: { type: Number },
  },
  
  employeeCredentials: {
    companyEmail: { type: String, required: true, unique: true }, // Ensure uniqueness
    companyPassword: { type: String },
  },

  documents: {
    resume: {
      documentName: { type: String},
      documentUrl: { type: String },
      documentSize: { type: String },
      uploadedAt: { type: Date },
    },
  },
  leaves: {
    casualLeave: { type: Number, default: 12 }, // Default 12 days of casual leave
    sickLeave: { type: Number, default: 10 },   // Default 10 days of sick leave
    paidLeave: { type: Number, default: 15 },   // Default 15 days of paid leave
    unpaidLeave: { type: Number, default: 5 },  // Default 5 days of unpaid leave
  },
});


const Employee = mongoose.model<IEmployee>('Employee', employeeSchema);

export default Employee;

