import IManager from "entities/managerEntity";
import { IBusinessOwnerDocument } from "../../entities/businessOwnerEntity";
import BaseRepository from "../implementation/baseRepository";
export default interface IBusinessOwnerRepository extends BaseRepository<IBusinessOwnerDocument>{
    registerBusinessOwner(businessOwnerData: any): Promise<IBusinessOwnerDocument>
    addSubscription(subscriptionData: any): Promise<any>
}