import mongoose, { Schema } from "mongoose";
import { IManagerDocument } from "../controllers/interface/IManagerController"; 

const managerSchema: Schema<IManagerDocument> = new Schema(
  {
    name: {
      type: String,
      // required: true,
    },
    email: {
      type: String,
      // required: true,
      // unique: true,
    },
    position: {
      type: String,
      // required: true,
    },
    phone: {
      type: String,
    },
    employeeId: {
      type: String,
      // required: true,
      // unique: true,
    },
    salary: {
      type: Number,
      required: true,
    },
    workTime: {
      type: String,
      // required: true,
    },
    joiningDate: {
      type: Date,
      // required: true,
      default: Date.now,
    },
    address: {
      street: { type: String },
      city: { type: String },
      state: { type: String },
      zip: { type: String },
      country: { type: String },
    },
    documents: [
      {
        documentName: {
          type: String,
          default: "HR Document",
        },
        documentUrl: {
          type: String,
          match: /^(http|https):\/\/[^ "]+$/, // URL validation
          required: true,
        },
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    companyCredentials: {
      companyName: {
        type: String,
        // required: true,
      },
      companyRegistrationNumber: {
        type: String,
        // required: true,
      },
      email: {
        type: String,
        // required: true,
      },
      password: {
        type: String,
        // required: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

const managerModel = mongoose.model<IManagerDocument>("manager", managerSchema);

export default managerModel;
