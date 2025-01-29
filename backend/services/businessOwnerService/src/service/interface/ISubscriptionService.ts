import { ISubscriptionDTO } from "../../dto/subscriptionDTO";

export default interface ISubscriptionService {
    getSubscription(businessOwnerId: string): Promise<ISubscriptionDTO>
    getAllSubscriptions(): Promise<ISubscriptionDTO[]>
    getInvoices(businessOwnerId: string): Promise<any>
}