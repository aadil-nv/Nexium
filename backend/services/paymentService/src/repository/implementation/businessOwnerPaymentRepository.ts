import { inject, injectable } from "inversify";
import mongoose from "mongoose";
import BaseRepository from "./baseRepository";
import IBusinessOwnerPaymentRepository from "../interface/IBusinessOwnerPaymentRepository";
import ISubscription from "../../entities/subscriptionEntity";
import { IBusinessOwnerDocument } from "../../entities/businessOwnerEntity";

@injectable()
export default class BusinessOwnerPaymentRepository
  extends BaseRepository<ISubscription>
  implements IBusinessOwnerPaymentRepository
{
  constructor(
    @inject("SubscriptionModel") private subscriptionModel: mongoose.Model<ISubscription>,
    @inject("BusinessOwnerModel") private businessOwnerModel: mongoose.Model<IBusinessOwnerDocument>
  ) {
    super(subscriptionModel);
  }

  async getAllSubscriptionPlans(): Promise<ISubscription[]> {
    try {
      const payments = await this.subscriptionModel.find();
      if (!payments.length) throw new Error("No payments found");
      return payments;
    } catch (error) {
      console.error("Error fetching payments:", error);
      throw error;
    }
  }

  async findBusinessOwner(businessOwnerId: string): Promise<IBusinessOwnerDocument> {
    console.log("Email from findBusinessOwner ", businessOwnerId);
    
    try {
      const businessOwner = await this.businessOwnerModel.findById(businessOwnerId).exec();
      console.log("Business owner from findBusinessOwner ", businessOwner);
      
      if (!businessOwner) throw new Error("Business owner not found");
      return businessOwner;
    } catch (error) {
      console.error("Error fetching business owner:", error);
      throw error;
    }
  }
  async findBusinessOwnerByEmail(email: string): Promise<IBusinessOwnerDocument> {    
    console.log("Email from findBusinessOwnerByEmail ", email);
    
    try {
      const businessOwner = await this.businessOwnerModel.findOne({ "personalDetails.email": email }).exec();
      console.log("Business owner from findBusinessOwnerByEmail ", businessOwner);
      if (!businessOwner) throw new Error("Business owner not found");
      return businessOwner;
    } catch (error) {
      console.error("Error fetching business owner:", error);
      throw error;
    }
  }
  

  async upgradePlan(plan: string, amount: number, currency: string, email: string): Promise<any> {
    try {
      const result = await this.businessOwnerModel.updateOne(
        { email },
        {
          $set: {
            "subscription.planName": plan,
            "subscription.price": amount,
            "subscription.currency": currency,
            "subscription.isActive": true,
            "subscription.updatedAt": new Date(),
          },
        }
      ).exec();
      if (!result.modifiedCount) throw new Error("Failed to upgrade the plan");
      return result;
    } catch (error) {
      console.error("Error upgrading plan:", error);
      throw error;
    }
  }

  async findByEmail(email: string): Promise<IBusinessOwnerDocument> {
    try {
      const businessOwner = await this.businessOwnerModel.findOne({ "personalDetails.email": email }).exec();
      if (!businessOwner) throw new Error("Business owner not found");
      return businessOwner;
    } catch (error) {
      console.error("Error finding business owner by email:", error);
      throw error;
    }
  }

  async updateSubscriptionByEmail(email: string, subscription: any): Promise<any> {
    console.log(`"subscription:"`.bgRed, subscription);
    
    try {
      const result = await this.businessOwnerModel.updateOne(
        { "personalDetails.email": email },
        { $set: { subscription } }
      ).exec();
      if (!result.modifiedCount) throw new Error("Subscription not updated");
      return result;
    } catch (error) {
      console.error("Error updating subscription by email:", error);
      throw error;
    }
  }

  async findNewSubscriptionPlan(planId: string): Promise<ISubscription[]> {
    try {
      const subscriptions = await this.subscriptionModel.find({ _id: planId }).exec();
      if (!subscriptions.length) throw new Error("No subscriptions found");
      return subscriptions;
    } catch (error) {
      console.error("Error fetching subscription plans:", error);
      throw error;
    }
  }
}
