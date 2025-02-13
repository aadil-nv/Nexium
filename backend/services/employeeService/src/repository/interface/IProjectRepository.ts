import BaseRepository from "../../repository/implementation/baseRepository";
import {IFile,IProject} from "../../entities/projectEntities"

export default interface IProjectRepository extends BaseRepository<IProject>{
    findAllProjects(employeeId: string , businessOwnerId :string): Promise<IProject[]>
    updateProjectStatus(projectId: string, status: string ,businessOwnerId:string): Promise<IProject>
    updateEmployeeFiles(projectId: string, fileUrl: string ,businessOwnerId:string): Promise<IProject>
    getProjectDashboardData(employeeId:string ,businessOwnerId:string):Promise<any>
}