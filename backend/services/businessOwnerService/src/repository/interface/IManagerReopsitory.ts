import BaseRepository from "repository/implementation/baseRepository";
import {IManager} from "../../entities/managerEntity";  // Assuming IManager is an interface for manager document
import { IBusinessOwnerDocument } from "../../entities/businessOwnerEntity"; // If necessary for any other purpose, you can still import it

export default interface IManagerRepository extends BaseRepository<IManager> {  // Corrected to IManager
    addManagers(businessOwnerId: string, managerData: IManager): Promise<IManager>;
    getAllManagers(businessOwnerId: string): Promise<IManager[]>;
    findById(id: string): Promise<IBusinessOwnerDocument>;
    findByEmail(businessOwnerId: string,emailId: string,): Promise<IManager | null>;   
    blockManager(businessOwnerId: string, managerData: IManager): Promise<any>;
}
