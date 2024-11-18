import { Request, Response } from "express";

export default interface IEmployeeController {
    addEmployees(req: Request, res: Response): Promise<void>;
    getEmployees(req: Request, res: Response): Promise<void>;
   
} 