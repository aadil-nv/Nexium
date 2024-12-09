import { Request, Response } from "express";
import { CustomRequest } from "middlewares/tokenAuthenticate";

export default interface IEmployeeController {
    addEmployees(req: Request, res: Response): Promise<void>;
    getEmployees(req: CustomRequest, res: Response): Promise<void>;

    updateEmployeePersonalInformation(req: CustomRequest, res: Response): Promise<void>;
    updateAddress(req: CustomRequest, res: Response): Promise<void>;
    updateEmployeeProfessionalInfo(req: CustomRequest, res: Response): Promise<void>;
    getEmployeeCredentials(req: CustomRequest, res: Response): Promise<void>;
    getEmployeeDocuments(req: CustomRequest, res: Response): Promise<void>;
    getEmployee(req: CustomRequest, res: Response): Promise<void>;
} 4