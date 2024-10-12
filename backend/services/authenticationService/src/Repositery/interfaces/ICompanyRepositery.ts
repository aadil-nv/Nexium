// src/repositories/interfaces/ICompanyRepository.ts
import { Document } from 'mongoose';

// Define the interface for company data
export interface ICompany extends Document {
    name: string;                     // Name of the company
    email: string;                    // Email of the company
    registration_number: string;      // Unique registration number
    address?: string;                 // Optional address field
    phone_number?: string;            // Optional phone number field
    created_at?: Date;                // Optional field for creation date
    updated_at?: Date;                // Optional field for last update date
}
