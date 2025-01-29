import { injectable, inject } from "inversify";
import IProjectRepository from "../../repository/interface/IProjectRepository";
import { IProject } from "../../entities/projectEntities";
import BaseRepository from "../../repository/implementation/baseRepository";
import { Model } from "mongoose";

@injectable()
export default class ProjectRepository extends BaseRepository<IProject> implements IProjectRepository {

    constructor(@inject("IProject") private _projectModel: Model<IProject>) {
        super(_projectModel);
    }

    async addNewProject(managerId: string, data: any, assignedEmployee: any): Promise<IProject> {

        console.log("assignedEmployee", assignedEmployee);
        console.log("data", data);
        console.log("managerId", managerId);
        
        
        
        try {
            // Add the assignedEmployee object to the project data
            data.assignedEmployee = assignedEmployee;
            data.assignedBy = managerId
    
            const newProject = new this._projectModel(data);
            const savedProject = await newProject.save();
    
            return savedProject;
        } catch (error) {
            console.error("Error creating project:", error);
            throw error;
        }
    }

    async findAllProjects(): Promise<IProject[]> {
        try {
            const projects = await this._projectModel.find().exec();
            if (!projects) {
                return [];
            }
            return projects;
        } catch (error) {
            console.error("Error finding projects:", error);
            throw error;
        }
    }

    async updateProject(projectId: string, data: any): Promise<IProject> {

        console.log(`data is ${data.data}`.bgWhite.bold);
        
        
        try {
            const updatedProject = await this._projectModel.findByIdAndUpdate(projectId, data, { new: true });
            if (!updatedProject) {
                throw new Error("Failed to update project");
            }
            return updatedProject;
        } catch (error) {
            console.error("Error updating project:", error);
            throw error;
        }
    }

    async deleteProject(projectId: string): Promise<IProject> {
        try {
            const deletedProject = await this._projectModel.findByIdAndDelete(projectId);
            if (!deletedProject) {
                throw new Error("Failed to delete project");
            }
            return deletedProject;
        } catch (error) {
            console.error("Error deleting project:", error);
            throw error;
        }
    }

    async updateProjectFile(projectId: string, file: any): Promise<IProject> {
        try {
            const updatedProject = await this._projectModel.findByIdAndUpdate(projectId, { projectFiles: file }, { new: true });
            if (!updatedProject) {
                throw new Error("Failed to update project file");
            }
            return updatedProject;
        } catch (error) {
            console.error("Error updating project file:", error);
            throw error;
        }

    }
    
}
