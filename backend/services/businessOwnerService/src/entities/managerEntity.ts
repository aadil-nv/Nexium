
import { Document } from "mongoose";

export default interface IManager extends Document {
  name: string;
  email: string;
  position: string;
  phone: string;
  employeeId: string;
  salary: number;
  workTime: string;
  joiningDate: Date;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  isActive: boolean;
  isVerified: boolean;
  companyCredentials: {
    companyName: string;
    companyRegistrationNumber: string;
    email: string;
    password: string;
  };
}
