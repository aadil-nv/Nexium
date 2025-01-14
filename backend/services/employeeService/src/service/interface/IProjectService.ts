import { IProjectDTO } from "../../dto/IProjectDTO"
import {IFile,IProject} from "../../entities/projectEntities"


export default interface IProjectService {
    getAllProjects(employeeId:string): Promise<IProjectDTO[]>
    updateProjectStatus(projectId: string, status: string): Promise<IProjectDTO>;
    updateEmployeeFiles(projectId: string, projectFiles: any): Promise<IProjectDTO>;
}