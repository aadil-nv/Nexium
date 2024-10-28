// IBusinessOwnerService.ts
import IManager from "../../entities/managerEntity";

export default interface IBusinessOwnerService {
    addManagers(companyId: string, hrManagerData: IManager): Promise<IManager>;
    findAllCompanies(): Promise<any[]>; // Add this line to define the method
}
