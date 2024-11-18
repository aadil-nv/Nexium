import { injectable } from "inversify";
import businessOwnerSchema from "../../model/businessOwnerModel";
import OtpModel from "../../model/otpModel";
import IBusinessOwnerRepository from "../interfaces/IBusinessOwnerRepository";
import { IBusinessOwnerDocument, ISubscription } from "../interfaces/IBusinessOwnerRepository";

@injectable()
export default class BusinessOwnerRepository implements IBusinessOwnerRepository {

  async findByEmail(email: string): Promise<IBusinessOwnerDocument | null> {
    return businessOwnerSchema.findOne({ email }).exec();
  }

  async create(businessOwnerData: IBusinessOwnerDocument): Promise<IBusinessOwnerDocument> {
    const businessOwner = new businessOwnerSchema(businessOwnerData);
    try {
      await businessOwner.save();
      return businessOwner;
    } catch (error) {
      console.error("Error saving business owner:", error);
      throw new Error("Error saving business owner data");
    }
  }

  async findOtpByEmail(email: string): Promise<any | null> {
    return OtpModel.findOne({ email }).exec();
  }

  async updateVerificationStatus(email: string): Promise<any> {
    return businessOwnerSchema.updateOne({ email }, { isVerified: true }).exec();
  }

  async updateSubscriptionByEmail(email: string, subscription: ISubscription): Promise<IBusinessOwnerDocument | null> {
    return businessOwnerSchema.findOneAndUpdate(
      { email },
      { subscription },
      { new: true }
    ).exec();
  }

  async updateOtp(email: string, otp: string): Promise<void> {
    const result = await OtpModel.updateOne(
      { email },
      { otp, createdAt: new Date(), updatedAt: new Date() }
    );

    if (result.modifiedCount === 0) {
      throw new Error('Failed to update OTP. No document found or OTP was not changed.');
    }
  }

  async updatePassword(email: string, hashedPassword: string): Promise<void> {
    await businessOwnerSchema.updateOne({ email }, { password: hashedPassword }).exec();
  }
}
