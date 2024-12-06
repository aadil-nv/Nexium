import { ISubscriptionDTO } from "dto/subscriptionDTO";
import { IBusinessOwnerDocument } from "../../entities/businessOwnerEntity";


export default interface IBusinessOwnerPaymentService{
    getAllPayments(): Promise<ISubscriptionDTO[]>
    findBusinessOwner(businessOwnerId: string): Promise<IBusinessOwnerDocument>
    upgradePlan(businessOwnerId: string,email: string , plan: any, ): Promise<any>
}