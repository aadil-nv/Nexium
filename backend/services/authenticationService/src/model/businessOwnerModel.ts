import mongoose, { Schema } from "mongoose";
import { IBusinessOwnerDocument } from "../entities/businessOwnerEntities"; // Adjust the import path as needed

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
       
      },
    },

    companyDetails: {
      companyName: {
        type: String,
      },
      companyLogo: {
        type: String,
       
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
          documentName: { type: String},
          documentUrl: { type: String },
          documentSize: { type: String },
          uploadedAt: { type: Date},
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
      default: "BusinessOwner",
    },


    subscription: {
      subscriptionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subscription', // Assuming 'Subscription' is the name of the model you're referencing
      },
      customerId: {
        type: String,

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

