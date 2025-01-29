import { Request, Response } from "express";
import { CustomRequest } from "../../middlewares/authMiddleware";
export default interface IEmployeeController {
    getProfile(req:CustomRequest, res:Response): Promise<any>;
}