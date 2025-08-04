import ISubscriptionRepository from "../interface/ISubscriptionRepository";
import subscriptionModel from "../../models/subscriptionModel";
import { injectable } from "inversify";

@injectable()
export default class SubscriptionRepository implements ISubscriptionRepository {

  async addSubscription(subscriptionData: string): Promise<any> {
    try {
      const newSubscription = new subscriptionModel(subscriptionData);
      return await newSubscription.save();
    } catch (error) {
      console.error("Error adding subscription:", error);
      throw new Error("Could not add subscription.");
    }
  }

  async fetchAllSubscriptions(): Promise<any> {
    try {
      return await subscriptionModel.find({});
    } catch (error) {
      console.error("Error fetching subscriptions:", error);
      throw new Error("Could not fetch subscriptions.");
    }
  }

  async updateById(id: string, updateData: any): Promise<any> {
    try {
      const { planType, planName, _id, ...allowedUpdates } = updateData;
      return await subscriptionModel.findByIdAndUpdate(id, allowedUpdates, { new: true });
    } catch (error) {
      console.error("Error updating subscription:", error);
      throw new Error("Could not update subscription.");
    }
  }
}
