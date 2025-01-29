import mongoose, { Schema, Document } from 'mongoose';

export interface IServiceRequest extends Document {
    businessOwnerId: mongoose.Schema.Types.ObjectId;  // Reference to the business owner
    companyName: string;
    companyLogo: string;
    serviceName: string;
    requestReason: string;
    status: string;  // Status can be 'Pending', 'In Progress', or 'Resolved'
  }