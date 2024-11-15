import mongoose, { Schema } from "mongoose";
import  IManager  from "../entities/managerEntity"; 

const managerSchema: Schema<IManager> = new Schema(
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
    managerType: {
      type: String,
      enum: ["HumanResourceManager" ,"GeneralManager" ,"ProjectManager" , "SalesManager"],
      required: true, // Assuming managerType is mandatory
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
      enum: ["Full-Time", "Part-Time", "Contract", "Temporary"], // Specify allowed values here
      required: true, // You can adjust whether this is mandatory or not
    },
    joiningDate: {
      type: Date,
      // required: true,
      default: Date.now,
    },
    profilePicture: {
      type: String,
      // required: true,
      default: "https://avatar.iran.liara.run/public/boy?username=Ash",
    },
    subscriptionId :{
      type: mongoose.Schema.Types.ObjectId,
      ref : "Subscription"
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
          // required: true,
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
    isBlocked: {
      type: Boolean,
      default: false,
    },
    managerCredentials: {
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
    businessOwnerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'BusinessOwner', // Assuming you have a BusinessOwner model
      // required: true, // Assuming this is a required field
    },
  },
  {
    timestamps: true,
  }
);

const managerModel = mongoose.model<IManager>("manager", managerSchema);

export default managerModel;
