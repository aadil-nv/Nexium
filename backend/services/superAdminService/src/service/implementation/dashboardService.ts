import { inject ,injectable } from "inversify";
import IDashboardService from "../interface/IDashboardService";
import IBusinessOwnerRepository from "../../repository/interface/IBusinessOwnerRepository";
import ISubscriptionRepository from "../../repository/interface/ISubscriptionRepository";

@injectable()
export default class DashboardService implements IDashboardService {
    constructor(@inject("IBusinessOwnerRepository") 
    private _businessOwnerRepository: IBusinessOwnerRepository) {}


 async getAllDashboardData(): Promise<any> {
    
    try {
      const businessOwners = await this._businessOwnerRepository.getDashboardData();
      
      return businessOwners 
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      throw new Error("Could not fetch dashboard data.");
    }
  }
}
