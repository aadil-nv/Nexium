import { Types } from "mongoose";

// Enum for company incorporation document type
export enum CompanyIncorporationDocType {
  CERTIFICATE_OF_INCORPORATION = "Certificate of Incorporation",
  OTHER = "other",
}

// Enum for business owner ID proof type
export enum BusinessOwnerIDProofType {
  PASSPORT = "Passport",
  DRIVER_LICENSE = "Driver License",
  NATIONAL_ID = "National ID",
  OTHER = "other",
}

// Interface for Subscription
