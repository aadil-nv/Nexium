import { inject ,injectable } from "inversify";
import IDashboardService from "../interface/IDashboardService";
import IManagerRepository from "../../repository/interface/IManagerRepository";

@injectable()
export default class DashboardService implements IDashboardService {
    constructor(

    @inject("IManagerRepository") 
    private managerRepository:IManagerRepository) {}


 async getAllDashboardData(companyId:string): Promise<any> {
    
    try {
      const manager = await this.managerRepository.getDashboardData(companyId)
    
      return {manager } 
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      throw new Error("Could not fetch dashboard data.");
    }
  }
}
