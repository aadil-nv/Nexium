import { IProject } from "../../entities/projectEntities";
import { IPayrollCriteria } from "../../entities/payrollCriteriaEntities";
import IBaseRepository from "./IBaseRepository";

// Corrected interface name to match the repository class method
export default interface IProjectRepository extends IBaseRepository<IProject> {

    addNewProject(managerId: string, data: any, assignedEmployee: any , businessOwnerId:string): Promise<IProject>
    findAllProjects(businessOwnerId:string): Promise<IProject[]>
    updateProject(projectId: string, data: any , businessOwnerId:string): Promise<IProject>
    deleteProject(projectId: string , businessOwnerId:string): Promise<IProject>
    updateProjectFile(projectId: string, file: any, businessOwnerId:string): Promise<IProject>

}
