import { inject, injectable } from "inversify";
import IBusinessOwnerPaymentRepository from "../interface/IBusinessOwnerPaymentRepository";
import ISubscription from "../../entities/subscriptionEntity";
import { IBusinessOwnerDocument } from "../../entities/businessOwnerEntity";
import mongoose from "mongoose";
import BaseRepository from "./baseRepository";
import subscriptionModel from "../../models/subscriptionModel";
import businessOwnerModel from "../../models/businessOwnerModel";

@injectable()
export default class BusinessOwnerPaymentRepository
  extends BaseRepository<ISubscription> 
  implements IBusinessOwnerPaymentRepository
{
  constructor(
    @inject("SubscriptionModel") private _subscriptionModel: mongoose.Model<ISubscription>,  // Primary model
    @inject("BusinessOwnerModel") private _businessOwnerModel: mongoose.Model<IBusinessOwnerDocument>  // Used for business owner operations
  ) {
    super(_subscriptionModel);  // Super constructor with subscription model
  }

  // Existing method to get all payments from the subscription model
  async getAllPayments(): Promise<ISubscription[]> {
    try {
      const payments = await this._subscriptionModel.find();  // Returns an array of ISubscription
      if (!payments || payments.length === 0) {
        throw new Error("No payments found");
      }
      return payments;
    } catch (error) {
      console.error("Error fetching payments:", error);
      throw error;
    }
  }

  // New method to find a business owner by their ID
  async findBusinessOwner(businessOwnerId: string): Promise<any> {
    try {
      const businessOwner = await this._businessOwnerModel.findById(businessOwnerId).exec();

      if (!businessOwner) {
        throw new Error("Business owner not found");
      }

      return businessOwner;
    } catch (error) {
      console.error("Error fetching business owner:", error);
      throw error;
    }
  }

  // Method to upgrade a business owner's plan (still uses businessOwnerModel)
  async upgradePlan(plan: string, amount: number, currency: string, email: string): Promise<any> {

    
    try {
      // Update the subscription details for the business owner
      const result = await this._businessOwnerModel.updateOne(
        { email }, // Filter by email
        {
          $set: { // Update these fields
            "subscription.planName": plan,
            "subscription.price": amount,
            "subscription.currency": currency,
            "subscription.isActive": true,
            "subscription.updatedAt": new Date() // Update timestamp
          },
        }
      ).exec();
      console.log('Result from upgradePlan service:', result);
      
  
      return result; // Return the update result
    } catch (error) {
      console.error("Error upgrading plan:", error);
      throw new Error("Failed to upgrade the plan. Please try again later.");
    }
  }
  

  // Find a business owner by email
  async findByEmail(email: string): Promise<IBusinessOwnerDocument> {
    try {
      const businessOwner = await this._businessOwnerModel.findOne({ "personalDetails.email":email }).exec();
      if (!businessOwner) {
        throw new Error("Business owner not found");
      }
      return businessOwner;
    } catch (error) {
      console.error("Error finding business owner by email:", error);
      throw error;
    }
  }

  // Update subscription information by email
  async updateSubscriptionByEmail(businessOwnerId: string, subscription: any): Promise<any> {
    console.log(`Inside updateSubscriptionByEmail service====================================`.bgRed);
    console.log("Business Owner ID:", businessOwnerId);
    console.log("Subscription:", subscription);
  
    try {
      // Ensure the correct field name is used in the filter
      const result = await this._businessOwnerModel.updateOne(
        { _id: businessOwnerId }, // Use the correct field name (_id for ObjectId)
        { $set: { subscription } } // Use $set to update the subscription field
      ).exec();
  
      console.log("Result from updateSubscriptionByEmail service:", result);
  
      if (result.modifiedCount === 0) {
        throw new Error("Subscription not updated");
      }
  
      return result;
    } catch (error) {
      console.error("Error updating subscription by email:", error);
      throw new Error("Failed to update subscription. Please try again.");
    }
  }
  
}
