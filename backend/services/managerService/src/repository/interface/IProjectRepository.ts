import { IPayrollCriteria } from "../../entities/payrollCriteriaEntities";
import IBaseRepository from "./IBaseRepository";

// Corrected interface name to match the repository class method
export default interface IProjectRepository extends IBaseRepository<IProject> {

    addNewProject(managerId:string , data:any): Promise<IProject>; // Changed to match the class method

}
