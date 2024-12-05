import { inject, injectable } from "inversify";
import ISubscriptionService from "../interface/ISubscriptionService";
import ISubscriptionRepository from "../../repository/interface/ISubscriptionRepository";
import { ISubscriptionDTO } from "../../dto/subscriptionDTO";


@injectable()

export default class SubscriptionService implements ISubscriptionService {
    private _subscriptionRepository: ISubscriptionRepository;
    
    constructor(@inject("ISubscriptionRepository")  subscriptionRepository: ISubscriptionRepository) {
        this._subscriptionRepository = subscriptionRepository;
    }

    async getSubscription(subscriptionId: string): Promise<ISubscriptionDTO> {
        try {
            const newSubscription = await this._subscriptionRepository.getSubscription(subscriptionId);
            console.log("newSubscription 777777777777777777777777777777777", newSubscription);
            
            return { 
                _id: newSubscription._id,
                subscriptionName: newSubscription.planName,
                subscriptiondescription: newSubscription.description,
                subscriptionPrice: newSubscription.price,
                subscriptionPlanType: newSubscription.planType,
                durationInMonths: newSubscription.durationInMonths,
                features: newSubscription.features,
                isActive: newSubscription.isActive
             };
        } catch (error) {
            console.error("Error adding subscription:", error);
            throw new Error("Could not add subscription.");
        }
    }
    async getAllSubscriptions(): Promise<any> {
        try {
            const newSubscription = await this._subscriptionRepository.getAllSubscriptions();
            console.log("newSubscription 777777777777777777777777777777777", newSubscription);
            if (!newSubscription) {
                throw new Error("Subscription not found");
            }
            
            return {newSubscription};
        } catch (error) {
            console.error("Error adding subscription:", error);
            throw new Error("Could not add subscription.");
        }
    }
}
   