import { Request, Response } from "express";
import { CustomRequest } from "middlewares/tokenAuthenticate";

export default interface IEmployeeController {
    addEmployees(req: Request, res: Response): Promise<void>;
    getEmployees(req: CustomRequest, res: Response): Promise<void>;
    getEmployeePersonalInformation(req: CustomRequest, res: Response): Promise<void>;
    getEmployeeAddress(req: CustomRequest, res: Response): Promise<void>;
} 