import {IManager} from "../../entities/managerEntity";
import { IBusinessOwnerDocument } from "../../entities/businessOwnerEntity";
import BaseRepository from "../implementation/baseRepository";
export default interface IBusinessOwnerRepository extends BaseRepository<IBusinessOwnerDocument>{
    addSubscription(subscriptionData: any): Promise<any>
    getDetails(businessOwnerId: string): Promise<IBusinessOwnerDocument>
    updateDetails(businessOwnerId: string, data: any): Promise<IBusinessOwnerDocument>
    uploadImages(businessOwnerId: string, file: any): Promise<IBusinessOwnerDocument>
    uploadLogo(businessOwnerId: string, file: any): Promise<IBusinessOwnerDocument>
    findIsBlocked(businessOwnerId: string): Promise<boolean | null>
    updateAddress(businessOwnerId: string, data: any): Promise<IBusinessOwnerDocument>
    uploadDocuments(businessOwnerId: string ,documentType:string,documentData:any ): Promise<IBusinessOwnerDocument>
    updateCompanyDetails(businessOwnerId: string, data: any): Promise<IBusinessOwnerDocument>
    getDashboardData(companyId:string):Promise<any>
    addServiceRequest(businessOwnerId: string,businessOwnerData: any, data: any): Promise<any>
    getAllServiceRequests(businessOwnerId: string): Promise<any[]>
    updateServiceRequest(serviceRequestId: string, data: any): Promise<any>

}