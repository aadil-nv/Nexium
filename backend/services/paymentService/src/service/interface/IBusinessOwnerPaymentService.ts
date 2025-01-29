import { ISubscriptionDTO } from "dto/subscriptionDTO";
import { IBusinessOwnerDocument } from "../../entities/businessOwnerEntity";
import ISubscription from "../../entities/subscriptionEntity";


export default interface IBusinessOwnerPaymentService{
    getAllSubscriptionPlans(): Promise<ISubscriptionDTO[]>
    findBusinessOwner(businessOwnerId: string): Promise<IBusinessOwnerDocument>
    upgradePlan(businessOwnerId: string,email: string , plan: any, ): Promise<any>
    handleWebhook(session: object): Promise<IBusinessOwnerDocument>
    createCheckoutSession(plan: string, amount: number, currency: string, email: string): Promise<any>
}