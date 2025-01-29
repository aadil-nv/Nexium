import { IEmployeesDTO } from "../../dto/IEmployeesDTO";
import { IProjectDTO, IProjectResponseDTO } from "../../dto/IProjectDTO";

export default interface IProjectService {
    addNewProject(managerId: string, data: any): Promise<IProjectResponseDTO | IProjectDTO>
    getAllTeamLeads(): Promise<IEmployeesDTO[]>
    getAllProjects(): Promise<IProjectDTO[]>
    updateProject(projectId: string, data: any): Promise<IProjectResponseDTO | IProjectDTO>
    deleteProject(projectId: string): Promise<IProjectDTO>
    updateProjectFile(projectId: string, file: any): Promise<IProjectDTO>
}