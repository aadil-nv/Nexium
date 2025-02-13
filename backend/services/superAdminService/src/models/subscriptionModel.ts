import mongoose, { Schema } from "mongoose";
import  ISubscription  from "../entities/subscriptionEntities";


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
      enum: ["Trial", "Basic", "Premium"],
    },
    durationInMonths: {
      type: Number,
      required: true,
    },
    features: {
      type: [String],
      default: [],
    },
    employeeCount: {
      type: Number,
      default: null, // null means unlimited
    },
    managerCount: {
      type: Number,
      default: null,
    },
    projectCount: {
      type: Number,
      default: null,
    },
    serviceRequestCount: {
      type: Number,
      default: null,
    },
    isActive: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  { timestamps: true }
);

// Pre-save middleware to handle Premium unlimited values
subscriptionPlanSchema.pre("save", function (next) {
  if (this.planType === "Premium") {
    this.employeeCount = null;
    this.managerCount = null;
    this.projectCount = null;
    this.serviceRequestCount = null;
  }
  next();
});

// Create the model based on the schema
const Subscription = mongoose.model<ISubscription>(
  "Subscription",
  subscriptionPlanSchema
);

export default Subscription;