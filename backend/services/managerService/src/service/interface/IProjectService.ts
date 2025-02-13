import { IEmployeesDTO } from "../../dto/IEmployeesDTO";
import { IProjectDTO, IProjectResponseDTO } from "../../dto/IProjectDTO";

export default interface IProjectService {
    addNewProject(managerId: string, data: any ,businessOwnerId:string): Promise<IProjectResponseDTO | IProjectDTO>
    getAllTeamLeads(businessOwnerId:string ): Promise<IEmployeesDTO[]>
    getAllProjects(businessOwnerId:string): Promise<IProjectDTO[]>
    updateProject(projectId: string, data: any, businessOwnerId:string): Promise<IProjectResponseDTO | IProjectDTO>
    deleteProject(projectId: string, businessOwnerId:string): Promise<IProjectDTO>
    updateProjectFile(projectId: string, file: any, businessOwnerId:string): Promise<IProjectDTO>
}