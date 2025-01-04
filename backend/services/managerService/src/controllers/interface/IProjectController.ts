import { CustomRequest } from "middlewares/tokenAuthenticate";
import  { Request, Response } from "express";

export default interface IProjectController {
    addNewProject(req: CustomRequest, res: Response): Promise<Response>
}