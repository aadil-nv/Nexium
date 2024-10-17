import mongoose from "mongoose";
import { IBusinessOwnerDocument,ISubscription } from "../interfaces/IBusinessOwnerRepositery";
import businessOwnerSchema from "../../Schemas/businessOwnerSchema";
import OtpModel from "../../Schemas/otpScheema";

export default class BusinessOwnerRepository {
  private useCompanyDb(registrationNumber: string) {
    const dbName = `company_${registrationNumber}`;
    return mongoose.connection.useDb(dbName);
  }

  async findByEmail(email: string): Promise<IBusinessOwnerDocument | null> {
    return await businessOwnerSchema.findOne({ email }).exec();
  }

  async create(companyData: IBusinessOwnerDocument): Promise<IBusinessOwnerDocument> {
    const company = new businessOwnerSchema(companyData);
    return await company.save();
  }

  async findOtpByEmail(email: string): Promise<any | null> {
    return await OtpModel.findOne({ email }).exec();
  }

  async updateVerificationStatus(email: string): Promise<any> {
    return await businessOwnerSchema.updateOne({ email }, { isVerified: true }).exec();
  }

  async updateSubscriptionByEmail(email: string, subscription: ISubscription): Promise<IBusinessOwnerDocument | null> {
    return await businessOwnerSchema.findOneAndUpdate(
      { email },
      { subscription },
      { new: true } // Return the updated document
    ).exec();
  }
}
