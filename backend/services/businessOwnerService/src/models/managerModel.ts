import mongoose, { Schema } from "mongoose";
import { IManager } from "../entities/managerEntity"; // Import the updated interface

const managerSchema: Schema<IManager> = new Schema(
  {
    personalDetails: {
      managerName: { type: String },
      personalWebsite: { type: String },
      email: { type: String },
      profilePicture: { type: String },
      phone: { type: String },
    },
    professionalDetails: {
      managerType: {
        type: String,
        enum: ["HumanResourceManager", "GeneralManager", "ProjectManager", "SalesManager"],
      },
      workTime: {
        type: String,
        enum: ["Full-Time", "Part-Time", "Contract", "Temporary"],
      },
      joiningDate: { type: Date, default: Date.now },
      designation: { type: String },
      salary: { type: Number },
    },
    address: {
      street: { type: String },
      city: { type: String },
      state: { type: String },
      postalCode: { type: String },
      country: { type: String },
    },
    companyDetails: {
      companyName: { type: String },
      companyLogo: { type: String },
      companyRegistrationNumber: { type: String },
      companyWebsite: { type: String },
    },
    documents: {
      resume: 
        {
          documentName: { type: String},
          documentUrl: { type: String },
          documentSize: { type: String },
          uploadedAt: { type: Date},
        },
    },
    managerCredentials: {
      companyEmail: { type: String },
      companyPassword: { type: String },
    },
    isActive: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
    businessOwnerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'BusinessOwner',
    },
    subscriptionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subscription",
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

const managerModel = mongoose.model<IManager>("Manager", managerSchema);

export default managerModel;
;
