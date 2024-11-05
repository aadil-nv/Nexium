// IBusinessOwnerService.ts
import IManager from "../../entities/managerEntity";

export default interface IBusinessOwnerService {
    addManagers(companyId: string, hrManagerData: IManager): Promise<IManager>;
    findAllManagers(companyId: string): Promise<any[]>; // Add this line to define the method
    registerBusinessOwner(businessOwnerData: string): Promise<any>;
}
