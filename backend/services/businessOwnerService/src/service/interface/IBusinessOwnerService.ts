// IBusinessOwnerService.ts
import IManager from "../../entities/managerEntity";

export default interface IBusinessOwnerService {
    addManagers(businessOwnerId: string, managerData: IManager): Promise<IManager>;
    findAllManagers(companyId: string): Promise<any[]>; // Add this line to define the method
    registerBusinessOwner(businessOwnerData: string): Promise<any>;
    setNewAccessToken(refreshToken: string): Promise<string>;
}
