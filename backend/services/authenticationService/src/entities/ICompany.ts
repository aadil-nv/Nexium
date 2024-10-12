import { Document, Types } from 'mongoose';

// Define the interface for subscription plans
export interface ISubscription {
    planName: string; // Name of the subscription plan
    planType: string; // e.g., "Trial", "Monthly", "Yearly"
    startDate: Date; // Start date of the subscription
    endDate: Date; // End date of the subscription
    status: string; // Status of the subscription (e.g., "Active", "Expired")
}

// Define the interface for the Company document
export interface ICompanyDocument extends Document {
    _id: Types.ObjectId; // Ensure _id is of type ObjectId and required
    name: string;
    email: string;
    address: string;
    password: string;
    phone: string;
    website?: string; // Make website optional
    registrationNumber: string;
    documents: {
        documentName: string;
        documentUrl: string;
        uploadedAt: Date;
    }[];
    subscription: ISubscription; // Subscription details
}

// Define the interface for the company entity used in registration and login
export interface ICompany extends Omit<ICompanyDocument, '_id'> {
    // _id is omitted because it is automatically managed by Mongoose
    // password is included for registration and login
}

// Define the interface for the token response
export interface ITokenResponse {
    accessToken: string;
    refreshToken: string;
}
