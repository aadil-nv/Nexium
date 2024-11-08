import ISubscriptionRepository from "../interface/ISubscriptionRepository";
import subscriptionModel from "../../models/subscriptionModel";
import { injectable } from "inversify";

@injectable()
export default class SubscriptionRepository implements ISubscriptionRepository {
   
    async addSubscription(subscriptionData: string) {
        try {
            const newSubscription = new subscriptionModel(subscriptionData);
             return await newSubscription.save();

        } catch (error) {
            console.error("Error adding subscription:", error);
            throw new Error("Could not add subscription.");
            
        }
    }

    async fetchAllSubscriptions() {
        try {
            const subscriptions = await subscriptionModel.find({});
            return subscriptions;
        } catch (error) {
            console.error("Error fetching subscriptions:", error);
            throw new Error("Could not fetch subscriptions.");
        }
    }

    async updateById(id: string, updateData: any): Promise<any> {
        try {
          // Exclude planType, planName, and _id from the update data
          const { planType, planName, _id, ...allowedUpdates } = updateData;
          
          const updatedSubscription = await subscriptionModel.findByIdAndUpdate(
            id,
            allowedUpdates,
            { new: true }
          );
          
          return updatedSubscription;
        } catch (error) {
          console.error("Error in repository while updating subscription:", error);
          throw new Error("Could not update subscription.");
        }
      }
}
