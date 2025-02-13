import {IManager} from "../../entities/managerEntities";
import BaseRepository from "../implementation/baseRepository";

export default interface IManagerRepository extends BaseRepository<IManager>  {
    getManagers(businessOwnerId: string): Promise<IManager[]>
    updateManagerPersonalInfo(managerId: string, data: any,businessOwnerId: string): Promise<IManager | null>
    findIsBlocked(managerId: string,businessOwnerId: string): Promise<boolean | null>
    getDetails(managerId: string , businessOwnerId: string): Promise<any>
    uploadProfilePicture(managerId: string, file: any,businessOwnerId: string): Promise<IManager>
    getLeaveEmployees(managerId: string,businessOwnerId: string): Promise<any>
    updateManagerAddress(managerId: string, data: any,businessOwnerId: string): Promise<any>
    uploadDocuments(managerId: string, documentType: string, documentData: Object,businessOwnerId: string): Promise<IManager>
    getDashboardData(managerId: string,businessOwnerId: string): Promise<any>
    updateManagerIsActive(managerId: string, isActive: boolean ,businessOwnerId: string): Promise<any> 
    findManager(managerId: string, businessOwnerId: string): Promise<IManager | null>
    findAllManagers(businessOwnerId: string): Promise<IManager[]>
    checkSubscriptionEmployee(businessOwnerId: string): Promise<boolean>
}