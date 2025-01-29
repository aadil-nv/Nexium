import {inject ,injectable } from "inversify";  
import { Request, Response } from "express";
import IProjectService from "../../service/interface/IProjectService";
import IProjectController from "../interface/IProjectController";
import { CustomRequest } from "../../middlewares/tokenAuthenticate";
import { uploadMiddleware } from "middlewares/uploadFile-s3";

@injectable()
export default class ProjectController implements IProjectController {
    constructor(
        @inject("IProjectService") private _projectService: IProjectService
    ) {}
    async addNewProject(req: CustomRequest, res: Response): Promise<Response> {
        
        try {
            const managerId  = req.user?.managerData?._id
            const data = req.body
            const response = await this._projectService.addNewProject(managerId as string , data);
            return res.status(200).json(response);
        } catch (error) {
            console.error("Error add new Projet:", error);
            return res.status(500).json({ message: "Failed to add new Project", error });
        }
    }

    async getAllTeamLeads(req: CustomRequest, res: Response): Promise<Response> {
        
        try {
            const managerId  = req.user?.managerData?._id
            
            const response = await this._projectService.getAllTeamLeads()
            
            return res.status(200).json(response);
            
        } catch (error) {
            return res.status(500).json({ message: "Failed to add new Project", error });
            
        }
    }

    async getAllProjects(req: CustomRequest, res: Response): Promise<Response> {
        try {
            const managerId  = req.user?.managerData?._id
            const response = await this._projectService.getAllProjects()
            return res.status(200).json(response);
            
        } catch (error) {
            return res.status(500).json({ message: "Failed to add new Project", error });
            
        }
    }

    async updateProject(req: CustomRequest, res: Response): Promise<Response> {
        // console.log(`"hitting update project================="`.bgYellow);
        
        try {
            const managerId  = req.user?.managerData?._id
            // console.log("maamagerId is ----",managerId);
            
            const projectId = req.params.id
            // console.log("projectId is ----",projectId);
            const data = req.body
            // console.log("data is ----",data);
            const response = await this._projectService.updateProject(projectId, data);
            // console.log("response--------------------------------",response);
            return res.status(200).json(response);
        } catch (error) {
            return res.status(500).json({ message: "Failed to add new Project", error });
            
        }
            }


         async deleteProject(req: CustomRequest, res: Response): Promise<Response> {
             try {
                 const managerId  = req.user?.managerData?._id
                 const projectId = req.params.id
                 const response = await this._projectService.deleteProject(projectId);
                 return res.status(200).json(response);
             } catch (error) {
                 return res.status(500).json({ message: "Failed to add new Project", error });
             }
         }   


         async updateProjectFile(req: CustomRequest, res: Response): Promise<Response> {
            console.log(`"hitting update project file================="`.bgYellow);
            
             try {
                 const projectId = req.params.id
                 // console.log("projectId is ----",projectId);

                 console.log("req.file$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$", req.file);
                 
                 const response = await this._projectService.updateProjectFile(projectId , req.file);
                 return res.status(200).json(response);
             } catch (error) {
                 return res.status(500).json({ message: "Failed to add new Project", error });
             }
         }
}