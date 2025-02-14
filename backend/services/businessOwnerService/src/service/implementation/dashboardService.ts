import { inject ,injectable } from "inversify";
import IDashboardService from "../interface/IDashboardService";
import IBusinessOwnerRepository from "../../repository/interface/IBusinessOwnerRepository";
import ISubscriptionRepository from "../../repository/interface/ISubscriptionRepository";
import IEmployeeRepository from "../../repository/interface/IEmployeeRepository";
import IManagerRepository from "../../repository/interface/IManagerReopsitory";

@injectable()
export default class DashboardService implements IDashboardService {
    constructor(@inject("IBusinessOwnerRepository") 
    private _businessOwnerRepository: IBusinessOwnerRepository,
    @inject("IEmployeeRepository") 
     private _employeeRepository:IEmployeeRepository,
    @inject("IManagerRepository") 
    private managerRepository:IManagerRepository) {}


 async getAllDashboardData(companyId:string): Promise<any> {
    console.log("hitinge serviceeeeeeeeeeeeeeeeeeeeeeeeeeee",companyId);
    
    try {
      const businessOwners = await this._businessOwnerRepository.getDashboardData(companyId);
      const employees = await this._employeeRepository.getDashboardData(companyId)
      const manager = await this.managerRepository.getDashboardData(companyId)

      console.log("buseinessowner ========================",businessOwners);
      console.log("employees ========================",employees);
      console.log("employees ========================",employees);
      
      return {businessOwners , employees , manager}; 
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      throw new Error("Could not fetch dashboard data.");
    }
  }
}
