import BaseRepository from "../implementation/baseRepository";
import  ISubscription  from "../../entities/subscriptionEntity";

export default interface ISubscriptionRepository extends BaseRepository<ISubscription> {
    getSubscription(subscriptionId: string): Promise<ISubscription>
    getAllSubscriptions(): Promise<ISubscription[]>
}