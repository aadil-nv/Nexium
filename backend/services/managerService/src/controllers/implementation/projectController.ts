import {inject ,injectable } from "inversify";  
import {Response } from "express";
import IProjectService from "../../service/interface/IProjectService";
import IProjectController from "../interface/IProjectController";
import { CustomRequest } from "../../middlewares/tokenAuthenticate";
import { HttpStatusCode } from "./../../utils/enums";

@injectable()
export default class ProjectController implements IProjectController {
    constructor(
        @inject("IProjectService") private _projectService: IProjectService
    ) {}
    async addNewProject(req: CustomRequest, res: Response): Promise<Response> {
        
        try {
            const managerId  = req.user?.managerData?._id
            const businessOwnerId = req.user?.managerData?.businessOwnerId
            const data = req.body
            const response = await this._projectService.addNewProject(managerId as string , data ,businessOwnerId as string);
            return res.status(HttpStatusCode.OK).json(response);
        } catch (error) {
            console.error("Error add new Projet:", error);
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: "Failed to add new Project", error });
        }
    }

    async getAllTeamLeads(req: CustomRequest, res: Response): Promise<Response> {
        
        try {
            const businessOwnerId = req.user?.managerData?.businessOwnerId
            
            const response = await this._projectService.getAllTeamLeads(businessOwnerId as string);
            
            return res.status(HttpStatusCode.OK).json(response);
            
        } catch (error) {
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: "Failed to add new Project", error });
            
        }
    }

    async getAllProjects(req: CustomRequest, res: Response): Promise<Response> {
        try {
            const managerId  = req.user?.managerData?._id
            const businessOwnerId = req.user?.managerData?.businessOwnerId
            const response = await this._projectService.getAllProjects(businessOwnerId as string)
            return res.status(HttpStatusCode.OK).json(response);
            
        } catch (error) {
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: "Failed to add new Project", error });
            
        }
    }

    async updateProject(req: CustomRequest, res: Response): Promise<Response> {
        
        try {
            const businessOwnerId = req.user?.managerData?.businessOwnerId
            
            const projectId = req.params.id
            const data = req.body
            const response = await this._projectService.updateProject(projectId, data,businessOwnerId as string);
            return res.status(HttpStatusCode.OK).json(response);
        } catch (error) {
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: "Failed to add new Project", error });
            
        }
    }


    async deleteProject(req: CustomRequest, res: Response): Promise<Response> {
             try {
                const businessOwnerId = req.user?.managerData?.businessOwnerId
                 const projectId = req.params.id
                 const response = await this._projectService.deleteProject(projectId,businessOwnerId as string);
                 return res.status(HttpStatusCode.OK).json(response);
             } catch (error) {
                 return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: "Failed to add new Project", error });
             }
         }   


    async updateProjectFile(req: CustomRequest, res: Response): Promise<Response> {
             try {
                 const projectId = req.params.id
                 const businessOwnerId = req.user?.managerData?.businessOwnerId                 
                 const response = await this._projectService.updateProjectFile(projectId , req.file,businessOwnerId as string);
                 return res.status(HttpStatusCode.OK).json(response);
             } catch (error) {
                 return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: "Failed to add new Project", error });
             }
    }
}