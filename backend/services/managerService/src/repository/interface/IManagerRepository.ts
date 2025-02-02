import {IManager} from "../../entities/managerEntities";
import BaseRepository from "../implementation/baseRepository";

export default interface IManagerRepository extends BaseRepository<IManager>  {
    getManagers(): Promise<IManager[]>
    updateManagerPersonalInfo(managerId: string, data: any): Promise<IManager | null>
    findIsBlocked(managerId: string): Promise<boolean | null>
    getDetails(managerId: string): Promise<any>
    uploadProfilePicture(managerId: string, file: any): Promise<IManager>
    getLeaveEmployees(managerId: string): Promise<any>
    updateManagerAddress(managerId: string, data: any): Promise<any>
    uploadDocuments(managerId: string, documentType: string, documentData: Object): Promise<IManager>
    getDashboardData(managerId: string): Promise<any>
    updateManagerIsActive(managerId: string, isActive: boolean): Promise<any> 
}