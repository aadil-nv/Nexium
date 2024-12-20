import mongoose, { Schema } from "mongoose";
import  {IManager} from "../entities/managerEntities";

const managerSchema: Schema<IManager> = new Schema(
  {
    personalDetails: {
      managerName: { type: String },
      personalWebsite: { type: String },
      email: { type: String },
      profilePicture: { type: String, default: "https://cdn.pixabay.com/photo/2018/08/28/12/41/avatar-3637425_1280.png" },
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
      companyLogo: { type: String  },
      companyRegistrationNumber: { type: String },
      companyWebsite: { type: String },
    },
    documents: [
      {
        documentName: { type: String, default: "HR Document" },
        documentUrl: { type: String, match: /^(http|https):\/\/[^ "]+$/ },
        uploadedAt: { type: Date, default: Date.now },
      },
    ],
    managerCredentials: {
      companyEmail: { type: String },
      companyPassword: { type: String },
    },
    isActive: { type: Boolean, default: true },
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
