import { ISubscriptionDTO } from "../../dto/subscriptionDTO";

export default interface ISubscriptionService {
    getSubscription(subscriptionId: string): Promise<ISubscriptionDTO>
    getAllSubscriptions(): Promise<ISubscriptionDTO[]>
}