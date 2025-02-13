import { CustomRequest } from "middlewares/tokenAuthenticate";
import  { Request, Response } from "express";

export default interface IPayrollController {
    getAllPayrollCriteria(req: CustomRequest, res: Response): Promise<Response>;
    updatePayrollCriteria(req: CustomRequest, res: Response): Promise<Response>
    deleteIncentive(req: CustomRequest, res: Response): Promise<Response>
}