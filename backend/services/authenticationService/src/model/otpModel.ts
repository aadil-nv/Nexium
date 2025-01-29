import mongoose, { Schema, Document } from "mongoose";

export interface IOtpDocument extends Document {
  email: string;
  otp: string;
  createdAt: Date;
  updatedAt: Date;
}

const otpSchema: Schema<IOtpDocument> = new Schema(
  {
    email: {
      type: String,
      required: true,
      // Ensure email is unique to prevent duplicates
    },
    otp: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 120, // Expires after 2 minutes (120 seconds)
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: true }, // Automatically handle createdAt and updatedAt fields
  }
);

const OtpModel = mongoose.model<IOtpDocument>("Otp", otpSchema);

export default OtpModel;
