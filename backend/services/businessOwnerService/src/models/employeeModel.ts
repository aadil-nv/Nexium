import mongoose from "mongoose";
import IEmployeeDocument from "../entities/employeeEntity";


const employeeSchema = new mongoose.Schema({
    hriId: {
      type: String,
      required: true,
      unique: true
    },
    name: {
      type: String,
      required: true
    },
    personalDetails: {
      address: {
        type: String,
        required: true
      },
      phone: {
        type: String,
        required: true
      },
      emergencyContact: {
        type: String,
        required: true
      },
      bloodGroup: {
        type: String,
        required: true
      },
      maritalStatus: {
        type: String,
        required: true
      }
    },
    professionalDetails: {
      designation: {
        type: String,
        required: true
      },
      department: {
        type: String,
        required: true
      },
      jobDescription: {
        type: String,
        required: true
      },
      experience: {
        type: Number,
        required: true
      },
      skills: {
        type: [String],
        required: true
      }
    },
    accountAccess: {
      companyEmail: {
        type: String,
        required: true,
        unique: true
      },
      password: {
        type: String,
        required: true
      }
    },
    documents: {
      type: [
        {
          documentType: {
            type: String,
            required: true
          },
          documentName: {
            type: String,
            required: true
          },
          documentPath: {
            type: String,
            required: true
          }
        }
      ],
      required: true
    },
    isActive: {
      type: Boolean,
      required: true,
      default: true
    },
    isVerified: {
      type: Boolean,
      required: true,
      default: false
    },
    joiningDate: {
      type: Date,
      required: true
    },
    role: {
      type: String,
      required: true
    }
  });
  
  const employeeModel = mongoose.model<IEmployeeDocument>('Employee', employeeSchema);
  export default employeeModel