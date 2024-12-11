import { Request, Response } from "express";
import { CustomRequest } from "../../middlewares/tokenAuthenticate";
export default interface  ILeaveController{
    updateLeaveApproval(req: CustomRequest, res: Response): Promise<void>;
    getAllLeaveEmployees(req: CustomRequest, res: Response): Promise<void>;
    
}