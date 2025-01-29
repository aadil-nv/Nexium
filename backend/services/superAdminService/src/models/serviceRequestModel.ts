import mongoose, { Schema, Document } from 'mongoose';
import {IServiceRequest} from "../entities/serviceRequestEntities"


const serviceRequestSchema: Schema = new Schema({
  businessOwnerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BusinessOwner', // Reference to BusinessOwner model
  },
  companyName: {
    type: String,
  },
  companyLogo: {
    type: String,
  },
  serviceName: {
    type: String,
  },
  requestReason: {
    type: String,
  },
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Resolved'],
    default: 'Pending'
  }
}, { timestamps: true });  // Includes createdAt and updatedAt timestamps

// Create and export the model
const ServiceRequest = mongoose.model<IServiceRequest>('ServiceRequest', serviceRequestSchema);
export default ServiceRequest;
