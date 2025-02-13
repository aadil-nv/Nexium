import {  Response } from "express";
import { CustomRequest } from "../../middlewares/tokenAuthenticate";

export default interface IDepartmentController {
    addDepartments(req: CustomRequest, res: Response): Promise<Response>;
    getDepartments(req: CustomRequest, res: Response): Promise<any>;
    removeEmployee(req: CustomRequest, res: Response): Promise<any>;
    deleteDepartment(req: CustomRequest, res: Response): Promise<any>;
    updateDepartmentName(req: CustomRequest, res: Response): Promise<any>;
    addEmployeesToDepartment(req: CustomRequest, res: Response): Promise<any>;
}