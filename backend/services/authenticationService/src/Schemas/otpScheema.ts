import mongoose, { Schema, Document } from "mongoose";

export interface IOtpDocument extends Document {
  email: string;
  otp: string;
  createdAt: Date;
}


const otpSchema: Schema<IOtpDocument> = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    otp: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      required: true,
      default: Date.now,
      expires: "2m",
    },
  },
  {
    timestamps: true,
  }
);

const OtpModel = mongoose.model<IOtpDocument>("Otp", otpSchema);

export default OtpModel;
