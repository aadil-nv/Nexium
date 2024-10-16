import { Document } from "mongoose";

export interface ICompany extends Document {
  name: string;
  email: string;
  registration_number: string;
  address?: string;
  phone_number?: string;
  created_at?: Date;
  updated_at?: Date;
}
