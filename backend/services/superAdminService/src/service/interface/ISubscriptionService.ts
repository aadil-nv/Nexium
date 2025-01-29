
import { Response } from "express";
export default interface ISubscriptionService {
    addSubscription(subscriptionData:any): Promise<Response>;
    fetchAllSubscriptions(): Promise<Response>;
    updateIsActive(id: string): Promise<Response>;
    updateSubscriptionDetails  (id: string, updateData: any): Promise<Response>;
   
}