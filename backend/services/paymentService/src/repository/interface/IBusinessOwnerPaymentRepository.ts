import { IBusinessOwnerDocument } from "../../entities/businessOwnerEntity";
import ISubscription from "../../entities/subscriptionEntity";
import BaseRepository from "../implementation/baseRepository";

export default interface IBusinessOwnerPaymentRepository  extends BaseRepository<ISubscription> {
        getAllPayments(): Promise<ISubscription[]>;
        upgradePlan(plan: string, amount: number, currency: string, email: string): Promise<ISubscription>
        findByEmail(email: string): Promise<IBusinessOwnerDocument>
        updateSubscriptionByEmail(email: string, subscription:any): Promise<any>
        findBusinessOwner(businessOwnerId: string): Promise<any>;
    }