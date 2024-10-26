import mongoose, { Schema } from "mongoose";
import { IBusinessOwnerDocument } from "../controllers/interface/IBusinessOwnerController"; // Adjust the import path as needed


const companySchema: Schema<IBusinessOwnerDocument> = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
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
    },
    website: {
      type: String,
      required: false,
    },
    registrationNumber: {
      type: String,
      required: true,

    },
    isVerified: {
      type: Boolean,
      required: true,
      default: false, 
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
          match: /^(http|https):\/\/[^ "]+$/, 
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
        enum: ["Trial", "Monthly", "Yearly"], 
      },
      startDate: {
        type: Date,
        required: true,
        default: Date.now,
      },
      endDate: {
        type: Date,
        required: true,
      },
      status: {
        type: String,
        required: true,
        enum: ["Active", "Expired"],
      },
    },
  },

  {
    timestamps: true, 
  }
);


const CompanyModel = mongoose.model<IBusinessOwnerDocument>(
  "Company",
  companySchema
);

export default CompanyModel;
