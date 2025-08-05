import { injectable, inject } from "inversify";
import IProjectRepository from "../../repository/interface/IProjectRepository";
import { IProject } from "../../entities/projectEntities";
import BaseRepository from "../../repository/implementation/baseRepository";
import { Model } from "mongoose";
import connectDB from "../../config/connectDB"

@injectable()
export default class ProjectRepository extends BaseRepository<IProject> implements IProjectRepository {

    constructor(@inject("IProject") private _projectModel: Model<IProject>) {
        super(_projectModel);
    }

    async addNewProject(managerId: string, data: any, assignedEmployee: any, businessOwnerId: string): Promise<IProject> {
        try {
            data.assignedEmployee = assignedEmployee;
            data.assignedBy = managerId;

            const switchDB = await connectDB(businessOwnerId);

            const ProjectModel = switchDB.model<IProject>("Project", this._projectModel.schema, "projects");
            const newProject = new ProjectModel(data);

            const savedProject = await newProject.save();

            return savedProject;
        } catch (error) {
            console.error("Error creating project:", error);
            throw new Error("Failed to create new project");
        }
    }


    async findAllProjects(businessOwnerId: string): Promise<IProject[]> {
        try {

            const switchDB = await connectDB(businessOwnerId);
            const projectsCollection = switchDB.collection<IProject>("projects");

            const projects = await projectsCollection.find({}).toArray();
            return projects;
        } catch (error) {
            console.error("Error finding projects:", error);
            throw error;
        }
    }


    async updateProject(projectId: string, data: any, businessOwnerId: string): Promise<IProject> {
        try {
            const switchDB = await connectDB(businessOwnerId);

            const updatedProject = await switchDB.model<IProject>("Project", this._projectModel.schema, "projects").findByIdAndUpdate(projectId, data, { new: true });

            if (!updatedProject) {
                throw new Error("Failed to update project");
            }

            return updatedProject;
        } catch (error) {
            console.error("Error updating project:", error);
            throw error;
        }
    }


    async deleteProject(projectId: string, businessOwnerId: string): Promise<IProject> {
        try {
            const switchDB = await connectDB(businessOwnerId);

            const deletedProject = await switchDB.model<IProject>("Project", this._projectModel.schema, "projects").findByIdAndDelete(projectId);

            if (!deletedProject) {
                throw new Error("Failed to delete project");
            }

            return deletedProject;
        } catch (error) {
            console.error("Error deleting project:", error);
            throw error;
        }
    }


    async updateProjectFile(projectId: string, file: any, businessOwnerId: string): Promise<IProject> {
        try {
            const switchDB = await connectDB(businessOwnerId);

            const updatedProject = await switchDB.model<IProject>("Project", this._projectModel.schema, "projects").findByIdAndUpdate(
                projectId,
                { projectFiles: file },
                { new: true }
            );

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
