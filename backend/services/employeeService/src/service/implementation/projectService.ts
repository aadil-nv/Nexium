import { inject, injectable } from "inversify";
import IProjectRepository from "../../repository/interface/IProjectRepository";
import IProjectService from "../interface/IProjectService";
import { IProjectDTO } from "../../dto/IProjectDTO";
import {getSignedImageURL ,uploadMiddleware ,uploadTosS3} from "../../middlewares/multer-s3"

@injectable()
export default class ProjectService implements IProjectService {
    constructor(@inject("IProjectRepository") private _projectRepository: IProjectRepository) {}


    async updateEmployeeFiles(projectId: string, projectFile: Express.Multer.File): Promise<IProjectDTO> {
        try {
            // Upload file to S3
            const s3Key = await uploadTosS3(projectFile.buffer, projectFile.mimetype);
            if (s3Key === "error") {
                throw new Error("File upload to S3 failed");
            }

            // Generate signed URL
            const fileUrl = await getSignedImageURL(s3Key);

            // Save file URL in the database
            const updatedProject = await this._projectRepository.updateEmployeeFiles(projectId, fileUrl);
            if (!updatedProject) {
                throw new Error("Project not found");
            }

            // Map the updated project to IProjectDTO if necessary
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

    async getAllProjects(employeeId: string): Promise<IProjectDTO[]> {
        try {
            // Fetch projects using the repository
            const projects = await this._projectRepository.findAllProjects(employeeId);

            // Transform the projects into DTOs
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

    async updateProjectStatus(projectId: string, status: string): Promise<IProjectDTO> {
        try {
            const updatedProject = await this._projectRepository.updateProjectStatus(projectId, status);
    
            if (!updatedProject) {
                throw new Error("Project not found");
            }
    
            // Map the updatedProject to IProjectDTO if necessary
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


    
}
