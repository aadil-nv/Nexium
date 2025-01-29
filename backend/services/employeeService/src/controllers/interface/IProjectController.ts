import { Request ,Response } from "express";
import { CustomRequest } from "../../middlewares/tokenAuth";

export default  interface IProjectController{
    getAllProjects(req:CustomRequest , res:Response):Promise<Response>
    updateProjectStatus(req:CustomRequest , res:Response):Promise<Response>
    updateEmployeeFiles(req:CustomRequest , res:Response):Promise<Response>
}