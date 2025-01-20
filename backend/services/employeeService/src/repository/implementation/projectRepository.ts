import { inject,injectable } from "inversify";
import IProjectRepository from "../../repository/interface/IProjectRepository";
import {IFile,IProject} from "../../entities/projectEntities"
import { FilterQuery, Model } from "mongoose";
import BaseRepository from "./baseRepository";


@injectable()
export default class ProjectRepository extends BaseRepository<IProject> implements IProjectRepository {
    constructor(@inject("IProject") private _projectModel:Model<IProject>){
        super(_projectModel)
    }

    async findAllProjects(employeeId: string): Promise<IProject[]> {
        try {
            // Find all projects where the assignedEmployee.employeeId matches the given employeeId
            const projects = await this._projectModel.find({
                'assignedEmployee.employeeId': employeeId,
            }).exec();
    
            return projects;
        } catch (error) {
            console.error("Error in findAllProjects:", error);
            throw new Error("Error fetching projects from the database");
        }
    }

    async updateProjectStatus(projectId: string, status: string): Promise<IProject> {
        try {
            const updatedProject = await this._projectModel.findOneAndUpdate(
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

    async updateEmployeeFiles(projectId: string, fileUrl: string): Promise<IProject> {
        try {
            const updatedProject = await this._projectModel.findOneAndUpdate(
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
    

    async getProjectDashboardData(employeeId: string): Promise<any> {
        try {
          // Fetch projects assigned to the employee
          const projects = await this._projectModel.find({
            'assignedEmployee.employeeId': employeeId,
          }).exec();
      
          return projects;
        } catch (error: any) {
          throw new Error(`Error in repository layer: ${error.message}`);
        }
      }
      
    

}
