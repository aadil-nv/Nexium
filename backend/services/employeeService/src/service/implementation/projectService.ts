import { inject, injectable } from "inversify";
import IProjectRepository from "../../repository/interface/IProjectRepository";
import IProjectService from "../interface/IProjectService";
import { IGetProjectDashboardData, IProjectDTO } from "../../dto/IProjectDTO";
import { getSignedImageURL, uploadMiddleware, uploadTosS3 } from "../../middlewares/multer-s3"
import { IProject } from "entities/projectEntities";

@injectable()
export default class ProjectService implements IProjectService {
    constructor(@inject("IProjectRepository") private _projectRepository: IProjectRepository) { }


    async updateEmployeeFiles(projectId: string, projectFile: Express.Multer.File,businessOwnerId:string): Promise<IProjectDTO> {
        try {
            const s3Key = await uploadTosS3(projectFile.buffer, projectFile.mimetype);
            if (s3Key === "error") {
                throw new Error("File upload to S3 failed");
            }

            const fileUrl = await getSignedImageURL(s3Key);

            const updatedProject = await this._projectRepository.updateEmployeeFiles(projectId, fileUrl ,businessOwnerId);
            if (!updatedProject) {
                throw new Error("Project not found");
            }

            return {
                projectId: updatedProject._id,
                projectName: updatedProject.projectName,
                description: updatedProject.description,
                startDate: updatedProject.startDate,
                endDate: updatedProject.endDate,
                status: updatedProject.status,
                managerStatus: updatedProject.managerStatus,
                assignedEmployee: updatedProject.assignedEmployee,
                projectFiles: updatedProject.projectFiles,
                createdAt: updatedProject.createdAt,
                updatedAt: updatedProject.updatedAt,
            };
        } catch (error) {
            console.error("Error in updateEmployeeFiles Service:", error);
            throw new Error("Error updating employee files");
        }
    }

    async getAllProjects(employeeId: string ,businessOwnerId :string ): Promise<IProjectDTO[]> {
        try {
            const projects = await this._projectRepository.findAllProjects(employeeId,businessOwnerId);

            const projectDTOs: IProjectDTO[] = projects.map((project) => ({
                projectId: project._id,
                projectName: project.projectName,
                description: project.description,
                startDate: project.startDate,
                endDate: project.endDate,
                status: project.status,
                assignedEmployee: {
                    employeeId: project.assignedEmployee.employeeId,
                    employeeName: project.assignedEmployee.employeeName,
                    employeeFiles: project.assignedEmployee.employeeFiles,
                },
                projectFiles: project.projectFiles,
                createdAt: project.createdAt,
                updatedAt: project.updatedAt,
                managerStatus: project.managerStatus,
            }));

            return projectDTOs;
        } catch (error) {
            console.error("Error in ProjectService:", error);
            throw new Error("Error fetching projects");
        }
    }

    async updateProjectStatus(projectId: string, status: string ,businessOwnerId:string): Promise<IProjectDTO> {
        try {
            const updatedProject = await this._projectRepository.updateProjectStatus(projectId, status ,businessOwnerId);

            if (!updatedProject) {
                throw new Error("Project not found");
            }

            return {
                projectId: updatedProject._id,
                projectName: updatedProject.projectName,
                description: updatedProject.description,
                startDate: updatedProject.startDate,
                endDate: updatedProject.endDate,
                status: updatedProject.status,
                managerStatus: updatedProject.managerStatus,
                assignedEmployee: updatedProject.assignedEmployee,
                projectFiles: updatedProject.projectFiles,
                createdAt: updatedProject.createdAt,
                updatedAt: updatedProject.updatedAt,
            };
        } catch (error) {
            console.error("Error in updateProjectStatus Service:", error);
            throw new Error("Error updating project status");
        }
    }

    async getProjectDashboardData(employeeId: string ,businessOwnerId:string): Promise<IGetProjectDashboardData> {
        try {
            const projectData = await this._projectRepository.getProjectDashboardData(employeeId ,businessOwnerId);

            if (!projectData) {
                throw new Error("No projects found for the given employee ID.");
            }

            const projectStatusCount = projectData.reduce((acc: Record<string, number>, project: IProject) => {
                acc[project.status] = (acc[project.status] || 0) + 1;
                return acc;
            }, {});

            const monthWiseCompletedProjects = projectData
                .filter((project: IProject) => project.status === 'completed')
                .reduce((acc: Record<string, number>, project: IProject) => {
                    const month = new Date(project.endDate).toLocaleString("default", { month: "long" });
                    acc[month] = (acc[month] || 0) + 1;  
                    return acc;
                }, {});

            const monthWiseData: { month: string; completedCount: number }[] = Object.entries(monthWiseCompletedProjects).map(
                ([month, completedCount]) => ({
                    month,
                    completedCount: completedCount as number,
                })
            );

            const dashboardData: IGetProjectDashboardData = {
                totalProjects: projectData.length,
                completedProjects: projectData.filter((project: IProject) => project.status === 'completed').length,
                inProgressProjects: projectData.filter((project: IProject) => project.status === 'inProgress').length,
                onHoldProjects: projectData.filter((project: IProject) => project.status === 'onHold').length,
                monthWiseCompletedProjects: monthWiseData,
                recentProjects: projectData
                    .sort((a: IProject, b: IProject) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
                    .slice(0, 5)
                    .map((project: IProject) => ({
                        projectName: project.projectName,
                        description: project.description,
                        startDate: project.startDate,
                        endDate: project.endDate,
                        status: project.status,
                        assignedEmployee: project.assignedEmployee.employeeName, 
                    })),
            };
            

            return dashboardData;
        } catch (error: any) {
            throw new Error(`Error in service layer: ${error.message}`);
        }
    }






}
