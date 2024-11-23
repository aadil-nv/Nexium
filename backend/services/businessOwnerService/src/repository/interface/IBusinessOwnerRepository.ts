import IManager from "entities/managerEntity";
import { IBusinessOwnerDocument } from "../../entities/businessOwnerEntity";
import BaseRepository from "../implementation/baseRepository";
export default interface IBusinessOwnerRepository extends BaseRepository<IBusinessOwnerDocument>{
    registerBusinessOwner(businessOwnerData: any): Promise<IBusinessOwnerDocument>
    addSubscription(subscriptionData: any): Promise<any>
    getDetails(businessOwnerId: string): Promise<IBusinessOwnerDocument>
    updateDetails(businessOwnerId: string, data: any): Promise<IBusinessOwnerDocument>
    uploadImages(businessOwnerId: string, file: any): Promise<IBusinessOwnerDocument>
}