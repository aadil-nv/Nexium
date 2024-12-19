import mongoose, { Schema } from "mongoose";
import { IBusinessOwnerDocument } from "../entities/businessOwnerEntity"; // Adjust the import path as needed



const businessOwnerSchema: Schema<IBusinessOwnerDocument> = new Schema(
  {
  
    personalDetails: {
      businessOwnerName: {
        type: String,
      },
      email: {
        type: String,
      },
      password: {
        type: String,
      },
      phone: {
        type: String,
      },
      personalWebsite: {
        type: String,
      },
      profilePicture: {
        type: String,
        default: "https://cdn.pixabay.com/photo/2018/08/28/12/41/avatar-3637425_1280.png",
      },
    },

    companyDetails: {
      companyName: {
        type: String,
      },
      companyLogo: {
        type: String,
        default: "811188cef8b1f8487a0c7cb19bf1ffa5a2fe5377703d1df6173f4fafea68b6bd",
      },
      companyRegistrationNumber: {
        type: String,
      },
      companyEmail: {
        type: String,
      },
      companyWebsite: {
        type: String,
      },
      
      // Documents Object
    },
    documents: {
      companyCertificate: 
        {
          documentName: { type: String },
          documentUrl: { type: String },
          documentSize: { type: String },
          uploadedAt: { type: Date },
        },
    },

    address: {
      street: {
        type: String,
      },
      city: {
        type: String,
      },
      state: {
        type: String,
      },
      postalCode: {
        type: String,
      },
      country: {
        type: String,
      },
    },

    isVerified: {
      type: Boolean,
      default: false,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
    },


    subscription: {
      subscriptionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subscription', // Assuming 'Subscription' is the name of the model you're referencing
      },
      startDate: {
        type: Date,
      },
      endDate: {
        type: Date,
      },
      status: {
        type: String,
        enum: ["Active", "Expired","Pending"],
      },
    },
  },
  {
    timestamps: true,
  }
);

const businessOwnerModel = mongoose.model<IBusinessOwnerDocument>(
  "BusinessOwner",
  businessOwnerSchema
);

export default businessOwnerModel;