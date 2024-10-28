import { Document, Types } from "mongoose";

// Define the structure of a subscription document
export interface ISubscription {
  planName: string;  // Name of the subscription plan
  planType: string;  // Type of subscription (e.g., free, premium)
  startDate: Date;   // Subscription start date
  endDate: Date;     // Subscription end date
  status: string;    // Status of the subscription (e.g., active, inactive)
}

// Define the structure of a company document
export interface ICompany extends Document {
  _id: Types.ObjectId; // Unique identifier for the company
  name: string;        // Name of the company
  email: string;       // Email address of the company
  address: string;     // Physical address of the company
  password: string;    // Password for the company's account
  phone: string;       // Phone number of the company
  website?: string;    // (Optional) Website URL of the company
  registrationNumber: string; // Company registration number
  isVerified: boolean;  // Verification status of the company
  role: string;         // Role of the user (e.g., admin, user)
  documents: {
    documentName: string; // Name of the uploaded document
    documentUrl: string;  // URL where the document is stored
    uploadedAt: Date;     // Date the document was uploaded
  }[]; 
  subscription: ISubscription; // Subscription details
}

// Define the repository interface
export default interface ISuperAdminRepository {
  /**
   * Fetches all companies from the database.
   * @returns {Promise<ICompany[]>} - A promise that resolves to an array of companies.
   */
  getAllCompanies(): Promise<ICompany[]>; // Method to fetch all companies

  /**
   * Fetches a company by its ID.
   * @param {string} id - The ID of the company.
   * @returns {Promise<ICompany | null>} - A promise that resolves to the company document or null if not found.
   */
  getCompanyById(id: string): Promise<ICompany | null>; // Method to fetch a company by ID

  /**
   * Creates a new company.
   * @param {ICompany} company - The company data to be created.
   * @returns {Promise<ICompany>} - A promise that resolves to the created company.
   */
  createCompany(company: ICompany): Promise<ICompany>; // Method to create a new company

  // You can add more methods if needed.
}
