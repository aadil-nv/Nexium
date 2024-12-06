import mongoose, { Schema } from "mongoose";
import { IBusinessOwnerDocument } from "../entities/businessOwnerEntities"; 
import { CompanyIncorporationDocType, BusinessOwnerIDProofType } from "../utils/enums";



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
      profileImage: {
        type: String,
        default: "https://example.com/default-profile-image.png",
      },
    },

    companyDetails: {
      companyName: {
        type: String,
      },
      companyLogo: {
        type: String,
        default: "https://example.com/default-logo.png",
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
      documents: {
        companyIncorporationDocument: {
          type: String,
          enum: Object.values(CompanyIncorporationDocType),
        },
        businessOwnerIdProof: {
          type: String,
          enum: Object.values(BusinessOwnerIDProofType),
        },
      },
    },

    address: {
      streetAddress: {
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
        ref: 'Subscription', 
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
