import { Request, Response } from "express";

export default interface IDepartmentController {
    addDepartments(req: Request, res: Response): Promise<Response>;
    getDepartments(req: Request, res: Response): Promise<any>;
    removeEmployee(req: Request, res: Response): Promise<any>;
    deleteDepartment(req: Request, res: Response): Promise<any>;
    updateDepartmentName(req: Request, res: Response): Promise<any>;
    addEmployeesToDepartment(req: Request, res: Response): Promise<any>;
}