import mongoose, { Schema, Document } from "mongoose";

// Define the interface for OTP documents
export interface IOtpDocument extends Document {
    email: string;
    otp: string;
    createdAt: Date;
}

// Create the OTP schema
const otpSchema: Schema<IOtpDocument> = new Schema(
    {
        email: {
            type: String,
            required: true,
            // You may want to add a unique index to prevent multiple OTPs for the same email at the same time
        },
        otp: {
            type: String,
            required: true,
        },
        createdAt: {
            type: Date,
            required: true,
            default: Date.now,
            expires: '2m' // Automatically delete the OTP document after 2 minutes
        }
    },
    {
        timestamps: true, // Automatically create createdAt and updatedAt fields
    }
);

// Create the OTP model
const OtpModel = mongoose.model<IOtpDocument>("Otp", otpSchema);

export default OtpModel;
