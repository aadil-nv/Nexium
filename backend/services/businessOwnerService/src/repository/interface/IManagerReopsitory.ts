import BaseRepository from "../implementation/baseRepository";
import {IManager} from "../../entities/managerEntity";  // Assuming IManager is an interface for manager document
import { IBusinessOwnerDocument } from "../../entities/businessOwnerEntity"; // If necessary for any other purpose, you can still import it

export default interface IManagerRepository extends BaseRepository<IManager> {  // Corrected to IManager
    addManagers(businessOwnerId: string, managerData: IManager): Promise<IManager>;
    getAllManagers(businessOwnerId: string): Promise<IManager[]>;
    findById(id: string): Promise<IBusinessOwnerDocument>;
    findByEmail(businessOwnerId: string,emailId: string,): Promise<IManager | null>;   
    blockManager(businessOwnerId: string, managerData: IManager): Promise<any>;
    findManagerById(managerId: string, businessOwnerId: string): Promise<IManager |null>;
    updatePersonalInfo(businessOwnerId: string, managerId: string, data: IManager): Promise<IManager | null>;
    updateProfessionalInfo(businessOwnerId: string, managerId: string, data: IManager): Promise<IManager | null>;
    updateAddressInfo(businessOwnerId: string, managerId: string, data: IManager): Promise<IManager | null>;
    getDetails(businessOwnerId: string ,managerId : string): Promise<IManager>;
    uploadProfilePic(businessOwnerId: string,managerId: string, filePath: string ): Promise<IManager>;
    getDashboardData(companyId: string): Promise<any>
    updateResume(businessOwnerId: string, managerId: string,documentData: any): Promise<IManager>;

}
