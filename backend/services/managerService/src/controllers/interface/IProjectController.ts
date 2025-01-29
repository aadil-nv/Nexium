import { CustomRequest } from "../../middlewares/tokenAuthenticate";
import  { Request, Response } from "express";

export default interface IProjectController {
    addNewProject(req: CustomRequest, res: Response): Promise<Response>
    getAllTeamLeads(req: CustomRequest, res: Response): Promise<Response>
    getAllProjects(req: CustomRequest, res: Response): Promise<Response>
    updateProject(req: CustomRequest, res: Response): Promise<Response>
    deleteProject(req: CustomRequest, res: Response): Promise<Response>
    updateProjectFile(req: CustomRequest, res: Response): Promise<Response>
}