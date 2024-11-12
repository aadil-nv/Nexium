// IBusinessOwnerService.ts
import IManager from "../../entities/managerEntity";

export default interface IBusinessOwnerService {

    registerBusinessOwner(businessOwnerData: string): Promise<any>;
    setNewAccessToken(refreshToken: string): Promise<string>;
}
