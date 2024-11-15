import mongoose, { Schema } from "mongoose";
import { IBusinessOwnerDocument } from "repository/interface/IBusinessOwnerModel"; // Adjust the import path as needed

const businessOwnerSchema: Schema<IBusinessOwnerDocument> = new Schema(
  {
    companyName: {
      type: String,
      // required: true,
    },
    businessOwnerName: {
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
    address: {
      type: String,
      // required: true,
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
      // required: true,
    },
    isVerified: {
      type: Boolean,
      // required: true,
      default: false,
    },
    isBlocked: {
      type: Boolean,
      // required: true,
      default: false,
    },
    role: {
      type: String,
      
    },
    documents: [
      {
        documentName: {
          type: String,
         
        },
        documentUrl: {
          type: String,
         
          match: /^(http|https):\/\/[^ "]+$/,
        },
        uploadedAt: {
          type: Date,
          
        },
      },
    ],
    subscription: {
      subscriptionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subscription',  // Assuming 'Subscription' is the name of the model you're referencing
        // required: true,
        
      },
      startDate: {
        type: Date,
        // required: true,
        
      },
      endDate: {
        type: Date,
        // required: true,
      },
      status: {
        type: String,
        // required: true,
        enum: ["Active", "Expired"],
      },
    },
    companyLogo: {
      type: String,
      required: false,
      default: "https://example.com/default-logo.png",
    },
    profileImage: {
      type: String,
      required: false,
      default: "https://example.com/default-profile-image.png",
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