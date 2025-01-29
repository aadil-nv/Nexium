import { inject, injectable } from "inversify";
import subscriptionModel from "../../models/subscriptionModel";
import mongoose from "mongoose";
import ISubscriptionRepository from "../interface/ISubscriptionRepository";
import  ISubscription  from "../../entities/subscriptionEntity";
import BaseRepository from "./baseRepository";

@injectable()
export default class SubscriptionRepository extends BaseRepository<ISubscription> implements  ISubscriptionRepository {
        constructor (
            @inject("subscriptionModel") private _subscriptionModel: mongoose.Model<ISubscription>
        ) {
            super(_subscriptionModel);
        }
        async getSubscription(subscriptionId: string): Promise<ISubscription> {
            console.log("subscriptionId==========================", subscriptionId);
            
                try {
                    const subscription = await this._subscriptionModel.findOne({_id: subscriptionId});
                    console.log("subscription==========================", subscription);
                    
                   if (!subscription) {
                    throw new Error("Subscription not found");
                   }
                return subscription;
                    
                } catch (error) {
                    console.error("Error adding subscription:", error);
                    throw new Error("Could not add subscription.");

                }
        }

        async getAllSubscriptions(): Promise<ISubscription[]> {
            try {
                const subscriptions = await this._subscriptionModel.find();
                return subscriptions;
            } catch (error) {
                console.error("Error adding subscription:", error);
                throw new Error("Could not add subscription.");
            }
        }
        
}   

    