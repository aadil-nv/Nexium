import { IProjectResponseDTO } from "../../dto/IProjectDTO";

export default interface IProjectService {
    addNewProject(managerId: string, data: any): Promise<IProjectResponseDTO>
}