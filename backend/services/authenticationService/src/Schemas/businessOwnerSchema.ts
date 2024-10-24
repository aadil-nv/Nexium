import mongoose, { Schema } from "mongoose";
import { IBusinessOwnerDocument } from "../Controllers/interface/IBusinessOwner"; // Adjust the import path as needed

// Create the Company schema
const companySchema: Schema<IBusinessOwnerDocument> = new Schema(
  {
    name: {
      type: String,
      required: true,
      // unique: true, // Ensure company names are unique
    },
    email: {
      type: String,
      required: true,
      // unique: true, // Ensure email addresses are unique
    
    },
    password: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      // match: /^[0-9]{10,15}$/, // Basic phone number validation
    },
    website: {
      type: String,
      required: false,
      // match: /^(http|https):\/\/[^ "]+$/, // Basic URL validation
    },
    registrationNumber: {
      type: String,
      required: true,
      // unique: true, // Ensure registration numbers are unique
    },
    isVerified: {
      type: Boolean,
      required: true,
      default: false, // Ensure registration numbers are unique
    },
    role: {
      type: String,
      default: "BusinessOwner",
      
    },
    documents: [
      {
        documentName: {
          type: String,
          default: "Company Document",
        },
        documentUrl: {
          type: String,
          default: "http://localhost:3000",
          match: /^(http|https):\/\/[^ "]+$/, // Basic URL validation for documents
        },
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    subscription: {
      planName: {
        type: String,
        required: true,
      },
      planType: {
        type: String,
        required: true,
        enum: ["Trial", "Monthly", "Yearly"], // Allowable subscription types
      },
      startDate: {
        type: Date,
        required: true,
        default: Date.now, // Defaults to the current date
      },
      endDate: {
        type: Date,
        required: true,
      },
      status: {
        type: String,
        required: true,
        enum: ["Active", "Expired"], // Allowable subscription statuses
      },
    },
    
  },
  
  {
    timestamps: true, // Automatically create createdAt and updatedAt fields
  }
);

// Create the Company model
const CompanyModel = mongoose.model<IBusinessOwnerDocument>("Company", companySchema);

export default CompanyModel;
