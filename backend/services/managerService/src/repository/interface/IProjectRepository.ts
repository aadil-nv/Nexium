import { IProject } from "../../entities/projectEntities";
import { IPayrollCriteria } from "../../entities/payrollCriteriaEntities";
import IBaseRepository from "./IBaseRepository";

// Corrected interface name to match the repository class method
export default interface IProjectRepository extends IBaseRepository<IProject> {

    addNewProject(managerId: string, data: any, assignedEmployee: any): Promise<IProject>
    findAllProjects(): Promise<IProject[]>
    updateProject(projectId: string, data: any): Promise<IProject>
    deleteProject(projectId: string): Promise<IProject>
    updateProjectFile(projectId: string, file: any): Promise<IProject>

}
