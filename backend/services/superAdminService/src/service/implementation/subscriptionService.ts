import ISubscriptionService from "service/interface/ISubscriptionService";
import IBaseRepository from "repository/interface/IBaseRepository";
import ISubscriptionRepository from "../../repository/interface/ISubscriptionRepository"; 
import { injectable, inject } from "inversify";
import RabbitMQMessager from "../../events/rabbitmq/producers/producer";

@injectable()
export default class SubscriptionService implements ISubscriptionService {
  private _subscriptionRepository: ISubscriptionRepository;
  private _baseRepository: IBaseRepository;

  constructor(
    @inject("ISubscriptionRepository") subscriptionRepository: ISubscriptionRepository,
    @inject("IBaseRepository") baseRepository: IBaseRepository
  ) {
    this._subscriptionRepository = subscriptionRepository;
    this._baseRepository = baseRepository;
  }

  async addSubscription(subscriptionData: any): Promise<any> {
    const { planName, description, price, planType, durationInMonths, isActive } = subscriptionData;

    try {
      if (!planName || !description || price === undefined || !planType || !durationInMonths)
        return { success: false, message: "Missing required fields." };

      if (typeof price !== "number" || price < 0)
        return { success: false, message: "Price must be a positive number." };

      if (!["Trial", "Basic", "Premium"].includes(planType))
        return { success: false, message: `Invalid planType. Allowed values are Trial, Basic, Premium.` };

      if (typeof durationInMonths !== "number" || durationInMonths <= 0)
        return { success: false, message: "Duration in months must be a positive integer." };

      if (typeof isActive !== "boolean")
        return { success: false, message: "isActive must be a boolean value." };

      if (await this._baseRepository.findByName(planName))
        return { success: false, message: `Subscription plan with name "${planName}" already exists.` };

      const newSubscription = await this._subscriptionRepository.addSubscription(subscriptionData);
      const rabbitMQMessager = new RabbitMQMessager();
      await rabbitMQMessager.init();
      await rabbitMQMessager.sendToMultipleQueues({ subscriptionData: newSubscription });

      return { success: true, message: "Subscription added successfully!", subscription: newSubscription };
    } catch (error) {
      console.error("Error adding subscription:", error);
      return { success: false, message: "Could not add subscription due to an internal error." };
    }
  }

  async fetchAllSubscriptions(): Promise<any> {
    try {
      const subscriptions = await this._subscriptionRepository.fetchAllSubscriptions();
      console.log("Subscriptions fetched:", subscriptions);
      
      return { success: true, subscriptions };
    } catch (error) {
      console.error("Error fetching subscriptions:", error);
      return { success: false, message: "Could not fetch subscriptions due to an internal error." };
    }
  }

  async updateIsActive(id: string): Promise<any> {
    try {
      const subscription = await this._baseRepository.findById(id);
      if (!subscription) return { success: false, message: "Subscription not found." };

      const updatedSubscription = await this._baseRepository.findByIdAndUpdate(id, { isActive: !subscription.isActive });
      return updatedSubscription
        ? { success: true, message: "Subscription status updated successfully!", subscription: updatedSubscription }
        : { success: false, message: "Failed to update subscription status." };
    } catch (error) {
      console.error("Error updating subscription:", error);
      return { success: false, message: "Internal error occurred while updating subscription." };
    }
  }

  async updateSubscriptionDetails(id: string, updateData: any): Promise<any> {
    try {
      const subscription = await this._baseRepository.findById(id);
      if (!subscription) return { success: false, message: "Subscription not found." };

      const updatedSubscription = await this._subscriptionRepository.updateById(id, updateData);
      return updatedSubscription
        ? { success: true, message: "Subscription details updated successfully!", subscription: updatedSubscription }
        : { success: false, message: "Failed to update subscription details." };
    } catch (error) {
      console.error("Error in service while updating subscription:", error);
      return { success: false, message: "Internal error occurred while updating subscription." };
    }
  }
}
