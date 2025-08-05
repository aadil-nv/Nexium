import { injectable } from "inversify";
import businessOwnerModel from "../../model/businessOwnerModel";
import OtpModel from "../../model/otpModel";
import IBusinessOwnerRepository from "../interfaces/IBusinessOwnerRepository";
import { IBusinessOwnerDocument, ISubscription } from "../../entities/businessOwnerEntities";
import mongoose from "mongoose";


@injectable()
export default class BusinessOwnerRepository implements IBusinessOwnerRepository {

  async findByEmail(email: string): Promise<IBusinessOwnerDocument | null> {
    try {
      const businessOwner = await businessOwnerModel.findOne({ "personalDetails.email": email }).exec();
      return businessOwner;
    } catch (error) {
      console.error("Error finding business owner by email:", error);
      throw new Error("Failed to find business owner by email");
    }
  }

  async create(businessOwnerData: IBusinessOwnerDocument): Promise<IBusinessOwnerDocument> {
    const businessOwner = new businessOwnerModel(businessOwnerData);
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

  async updateVerificationStatus(email: string): Promise<{ success: boolean; message: string }> {
    try {
      const result = await businessOwnerModel.updateOne(
        { "personalDetails.email": email },
        { $set: { "isVerified": true } }
      ).exec();

      if (result.modifiedCount === 0) {
        throw new Error("No business owner found with the provided email or already verified.");
      }

      return { success: true, message: "Verification status updated successfully." };
    } catch (error) {
      console.error("Error updating verification status:", error);
      return { success: false, message: error instanceof Error ? error.message : "Unknown error occurred." };
    }
  }

  async updateSubscriptionByEmail(email: string, subscription: ISubscription): Promise<IBusinessOwnerDocument | null> {
    try {
      const updatedBusinessOwner = await businessOwnerModel.findOneAndUpdate(
        { "personalDetails.email": email },
        { $set: { "subscription": subscription } },
        { new: true }
      ).exec();

      if (!updatedBusinessOwner) {
        throw new Error("No business owner found with the provided email.");
      }

      return updatedBusinessOwner;
    } catch (error) {
      console.error("Error updating subscription:", error);
      throw new Error(error instanceof Error ? error.message : "Unknown error occurred.");
    }
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
    try {
      const result = await businessOwnerModel.updateOne(
        { "personalDetails.email": email },
        { $set: { "personalDetails.password": hashedPassword } }
      ).exec();

      if (result.modifiedCount === 0) {
        throw new Error("No business owner found or password is already up to date.");
      }
    } catch (error) {
      console.error("Error updating password:", error);
      throw new Error(error instanceof Error ? error.message : "Unknown error occurred.");
    }
  }

  async updateBusinessOwner(businessOwnerId: any, businessOwnerData: Partial<IBusinessOwnerDocument>): Promise<any> {


    try {

      const updatedBusinessOwner = await businessOwnerModel.findOneAndUpdate(
        { _id: businessOwnerId },
        { $set: businessOwnerData },
        { new: true }
      ).exec();

      return updatedBusinessOwner;

    } catch (error) {
      console.error("Error updating business owner:", error);
      throw new Error(error instanceof Error ? error.message : "Unknown error occurred.");

    }
  }

  async findBusinessOwnerById(id: string): Promise<IBusinessOwnerDocument | null> {
    try {
      const businessOwner = await businessOwnerModel.findById(id).exec();
      return businessOwner;
    } catch (error) {
      console.error("Error finding business owner by ID:", error);
      throw new Error("Failed to find business owner by ID");
    }
  }

  async updateisActive(id: any, isActive: boolean): Promise<IBusinessOwnerDocument | null> {
    try {
      const _switchDb = mongoose.connection.useDb(id.toString(), { useCache: true });
      const switchedDB = _switchDb.model('businessowners', businessOwnerModel.schema);
      const businessOwner = await businessOwnerModel.findOneAndUpdate(
        { _id: id },
        { $set: { isActive } },
        { new: true }
      ).exec();
      await switchedDB.findOneAndUpdate(
        { _id: id },
        { $set: { isActive } },
        { new: true }
      )
      return businessOwner;
    } catch (error) {
      console.error("Error updating business owner:", error);
      throw new Error(error instanceof Error ? error.message : "Unknown error occurred.");
    }
  }

}  
