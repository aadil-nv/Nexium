import { inject, injectable } from "inversify";
import ISubscriptionService from "../interface/ISubscriptionService";
import ISubscriptionRepository from "../../repository/interface/ISubscriptionRepository";
import IBusinessOwnerRepository from "../../repository/interface/IBusinessOwnerRepository"; // Adjust the import path
import { ISubscriptionDTO } from "../../dto/subscriptionDTO";
import { ObjectId } from "mongodb";
import mongoose from "mongoose";

@injectable()
export default class SubscriptionService implements ISubscriptionService {
    private _subscriptionRepository: ISubscriptionRepository;
    private _businessOwnerRepository: IBusinessOwnerRepository;

    constructor(
        @inject("ISubscriptionRepository") subscriptionRepository: ISubscriptionRepository,
        @inject("IBusinessOwnerRepository") businessOwnerRepository: IBusinessOwnerRepository
    ) {
        this._subscriptionRepository = subscriptionRepository;
        this._businessOwnerRepository = businessOwnerRepository;
    }



    async getSubscription(businessOwnerId: string): Promise<ISubscriptionDTO> {
        try {
            // Convert businessOwnerId (string) to ObjectId
            const objectId = new mongoose.Types.ObjectId(businessOwnerId);

    
            // Use the businessOwnerRepository to fetch business owner data
            const businessOwnerData = await this._businessOwnerRepository.findOne({ _id: objectId });
            console.log("Business Owner Data:", businessOwnerData);
    
            const subscriptionId = businessOwnerData?.subscription?.subscriptionId;
            if (!subscriptionId) {
                throw new Error("Subscription not found");
            }
    
            // Get the subscription details
            const subscription = await this._subscriptionRepository.getSubscription(subscriptionId.toString()); // Ensure subscriptionId is a string
            console.log("Subscription Data:", subscription);
    
            return {
                _id: subscription._id,
                planName: subscription.planName,
                description: subscription.description,
                price: subscription.price,
                planType: subscription.planType,
                durationInMonths: subscription.durationInMonths,
                features: subscription.features,
                isActive: subscription.isActive,
            };
        } catch (error) {
            console.error("Error fetching subscription:", error);
            throw new Error("Could not fetch subscription.");
        }
    }
    

    async getAllSubscriptions(): Promise<any> {
        try {
            const subscriptions = await this._subscriptionRepository.getAllSubscriptions();
            console.log("All Subscriptions:", subscriptions);
            if (!subscriptions) {
                throw new Error("Subscriptions not found");
            }

            return { subscriptions };
        } catch (error) {
            console.error("Error fetching all subscriptions:", error);
            throw new Error("Could not fetch subscriptions.");
        }
    }
}
