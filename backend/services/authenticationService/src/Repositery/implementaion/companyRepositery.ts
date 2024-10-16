import mongoose from "mongoose";
import { ICompanyDocument,ISubscription } from "../../entities/ICompany";
import CompanyModel from "../../Schemas/companyRecordsSchema";
import OtpModel from "../../Schemas/otpScheema";

export default class CompanyRepository {
  private useCompanyDb(registrationNumber: string) {
    const dbName = `company_${registrationNumber}`;
    return mongoose.connection.useDb(dbName);
  }

  async findByEmail(email: string): Promise<ICompanyDocument | null> {
    return await CompanyModel.findOne({ email }).exec();
  }

  async create(companyData: ICompanyDocument): Promise<ICompanyDocument> {
    const company = new CompanyModel(companyData);
    return await company.save();
  }

  async findOtpByEmail(email: string): Promise<any | null> {
    return await OtpModel.findOne({ email }).exec();
  }

  async updateVerificationStatus(email: string): Promise<any> {
    return await CompanyModel.updateOne({ email }, { isVerified: true }).exec();
  }

  async updateSubscriptionByEmail(email: string, subscription: ISubscription): Promise<ICompanyDocument | null> {
    return await CompanyModel.findOneAndUpdate(
      { email },
      { subscription },
      { new: true } // Return the updated document
    ).exec();
  }
}
