import {IManager} from "entities/managerEntity";
import { IBusinessOwnerDocument } from "../../entities/businessOwnerEntity";
import BaseRepository from "../implementation/baseRepository";
export default interface IBusinessOwnerRepository extends BaseRepository<IBusinessOwnerDocument>{
    addSubscription(subscriptionData: any): Promise<any>
    getDetails(businessOwnerId: string): Promise<IBusinessOwnerDocument>
    updateDetails(businessOwnerId: string, data: any): Promise<IBusinessOwnerDocument>
    uploadImages(businessOwnerId: string, file: any): Promise<IBusinessOwnerDocument>
    uploadLogo(businessOwnerId: string, file: any): Promise<IBusinessOwnerDocument>
    findIsBlocked(businessOwnerId: string): Promise<boolean | null>
}