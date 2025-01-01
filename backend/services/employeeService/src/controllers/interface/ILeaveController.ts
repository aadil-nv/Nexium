import { Request, Response } from "express";
import { CustomRequest } from "../../middlewares/tokenAuth";


export  default  interface ILeaveController {
    applyLeave(req: CustomRequest, res: Response): Promise<Response>;
    fetchAppliedLeaves(req: CustomRequest, res: Response): Promise<Response>;
    updateAppliedLeave(req: CustomRequest, res: Response): Promise<Response>;
    deleteAppliedLeave(req: CustomRequest, res: Response): Promise<Response>;

   
}