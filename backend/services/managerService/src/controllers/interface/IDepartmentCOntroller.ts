import { Request, Response } from "express";

export default interface IDepartmentController {
    addDepartments(req: Request, res: Response): Promise<any>;
    getDepartments(req: Request, res: Response): Promise<any>;
    removeEmployee(req: Request, res: Response): Promise<any>;
    deleteDepartment(req: Request, res: Response): Promise<any>;
}