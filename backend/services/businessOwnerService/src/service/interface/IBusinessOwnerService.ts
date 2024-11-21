// IBusinessOwnerService.ts
import IManager from "../../entities/managerEntity";

export default interface IBusinessOwnerService {

    registerBusinessOwner(businessOwnerData: string): Promise<any>;
    setNewAccessToken(decoded: any): Promise<string>;
    addSubscription(subscriptionData: any): Promise<any>;
    
}
