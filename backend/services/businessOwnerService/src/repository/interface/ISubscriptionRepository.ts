import BaseRepository from "../implementation/baseRepository";
import  ISubscription  from "../../entities/subscriptionEntity";

export default interface ISubscriptionRepository extends BaseRepository<ISubscription> {
    getSubscription(subscriptionId: string): Promise<ISubscription>
    getAllSubscriptions(): Promise<ISubscription[]>
    checkSubscriptionService(businessOwnerId: string): Promise<boolean>
    checkSubscriptionEmployee(businessOwnerId: string): Promise<boolean>
    checkSubscriptionManager(businessOwnerId: string): Promise<boolean>
}