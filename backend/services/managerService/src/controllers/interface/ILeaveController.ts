import { Request, Response } from "express";
import { CustomRequest } from "../../middlewares/tokenAuthenticate";
export default interface  ILeaveController{
    updateLeaveApproval(req: CustomRequest, res: Response): Promise<Response>;
    getAllLeaveEmployees(req: CustomRequest, res: Response): Promise<void>;
    getAllLeaveTypes(req: CustomRequest, res: Response): Promise<Response>;
    updateLeaveTypes(req: CustomRequest, res: Response): Promise<Response>;
    fetchAllPreAppliedLeaves(req: CustomRequest, res: Response): Promise<Response>;
    updatePreAppliedLeaves(req: CustomRequest, res: Response): Promise<Response>;
    
}