import {inject ,injectable } from "inversify";  
import { Request, Response } from "express";
import IProjectService from "../../service/interface/IProjectService";
import IProjectController from "../interface/IProjectController";
import { CustomRequest } from "../../middlewares/tokenAuthenticate";

@injectable()
export default class ProjectController implements IProjectController {
    constructor(
        @inject("IProjectService") private _projectService: IProjectService
    ) {}
    async addNewProject(req: CustomRequest, res: Response): Promise<Response> {
        console.log("hitting get payroll criteria==================");
        
        try {
            const managerId  = req.user?.managerData?._id
            console.log("maamagerId is ----",managerId);
            
            const data = req.body

            console.log("data from the body -->>>",data);
            
            const response = await this._projectService.addNewProject(managerId as string , data);
            console.log("response--------------------------------",response);
            
            return res.status(200).json(response);
        } catch (error) {
            console.error("Error add new Projet:", error);

            return res.status(500).json({ message: "Failed to add new Project", error });

        }
    }
}