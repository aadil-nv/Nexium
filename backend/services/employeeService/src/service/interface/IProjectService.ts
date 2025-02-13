import { IGetProjectDashboardData, IProjectDTO } from "../../dto/IProjectDTO"


export default interface IProjectService {
    getAllProjects(employeeId:string,businessOwnerId:string): Promise<IProjectDTO[]>
    updateProjectStatus(projectId: string, status: string ,businessOwnerId:string): Promise<IProjectDTO>;
    updateEmployeeFiles(projectId: string, projectFiles: any, businessOwnerId:string): Promise<IProjectDTO>;
    getProjectDashboardData(employeeId: string ,businessOwnerId:string): Promise<IGetProjectDashboardData>

}