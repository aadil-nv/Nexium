import { inject, injectable } from "inversify";
import IProjectRepository from "../../repository/interface/IProjectRepository";
import { IProject } from "../../entities/projectEntities"
import { Model } from "mongoose";
import BaseRepository from "./baseRepository";
import connectDB from "../../config/connectDB";


@injectable()
export default class ProjectRepository extends BaseRepository<IProject> implements IProjectRepository {
    constructor(@inject("IProject") private _projectModel: Model<IProject>) {
        super(_projectModel)
    }

    async findAllProjects(employeeId: string, businessOwnerId: string): Promise<IProject[]> {
        try {
            const switchDB = connectDB(businessOwnerId)
            const projects = await (await switchDB).model<IProject>('Project', this._projectModel.schema).find({
                'assignedEmployee.employeeId': employeeId,
            }).exec();

            return projects;
        } catch (error) {
            console.error("Error in findAllProjects:", error);
            throw new Error("Error fetching projects from the database");
        }
    }

    async updateProjectStatus(projectId: string, status: string, businessOwnerId: string): Promise<IProject> {
        try {
            const updatedProject = await (await connectDB(businessOwnerId)).model<IProject>('Project', this._projectModel.schema).findOneAndUpdate(
                { _id: projectId },
                { status },
                { new: true }
            ).exec();

            if (!updatedProject) {
                throw new Error("Project not found");
            }

            return updatedProject;
        } catch (error) {
            console.error("Error in updateProjectStatus Repository:", error);
            throw new Error("Error updating project status in database");
        }
    }

    async updateEmployeeFiles(projectId: string, fileUrl: string, businessOwnerId: string): Promise<IProject> {
        try {
            const switchDB = connectDB(businessOwnerId)
            const updatedProject = await (await switchDB).model<IProject>('Project', this._projectModel.schema).findOneAndUpdate(
                { _id: projectId },
                { $push: { 'assignedEmployee.employeeFiles': fileUrl } }, // Append the file URL
                { new: true }
            ).exec();

            if (!updatedProject) {
                throw new Error("Project not found");
            }

            return updatedProject;
        } catch (error) {
            console.error("Error in updateEmployeeFiles Repository:", error);
            throw new Error("Error updating employee files in database");
        }
    }


    async getProjectDashboardData(employeeId: string, businessOwnerId: string): Promise<any> {
        try {
            const switchDB = connectDB(businessOwnerId)
            const projects = await (await switchDB).model<IProject>('Project', this._projectModel.schema).find({
                'assignedEmployee.employeeId': employeeId,
            }).exec();

            return projects;
        } catch (error: any) {
            throw new Error(`Error in repository layer: ${error.message}`);
        }
    }


}
