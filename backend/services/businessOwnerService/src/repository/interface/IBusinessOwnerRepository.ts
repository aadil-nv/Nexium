import IManager from "entities/managerEntity";
import { IBusinessOwnerDocument } from "./IBusinessOwnerModel";
import BaseRepository from "../implementation/baseRepository";
export default interface IBusinessOwnerRepository extends BaseRepository<IBusinessOwnerDocument>{
    registerBusinessOwner(businessOwnerData: any): Promise<IBusinessOwnerDocument>
    addSubscription(subscriptionData: any): Promise<any>
}