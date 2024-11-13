import mongoose, { Schema } from "mongoose";
import  ISubscription  from "../entities/subscriptionEntity";


const subscriptionPlanSchema: Schema<ISubscription> = new Schema(
  {
    planName: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    planType: {
      type: String,
      required: true,
      enum: ["Trial", "Basic", "Premium"], // Enum for plan types
    },
    durationInMonths: {
      type: Number,
      required: true,
    },
    features: {
      type: [String],
      default: [],
    },
    isActive: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
  }
);

// Create the model based on the schema
const Subscription= mongoose.model<ISubscription>(
  "Subscription",
  subscriptionPlanSchema
);

export default Subscription
