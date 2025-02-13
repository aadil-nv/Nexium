import { Request, Response } from "express";
import { CustomRequest } from "middlewares/tokenAuthenticate";

export default interface IEmployeeController {
    addEmployees(req: CustomRequest, res: Response): Promise<void>;
    getEmployees(req: CustomRequest, res: Response): Promise<void>;

    updateEmployeePersonalInformation(req: CustomRequest, res: Response): Promise<void>;
    updateAddress(req: CustomRequest, res: Response): Promise<void>;
    updateEmployeeProfessionalInfo(req: CustomRequest, res: Response): Promise<void>;
    getEmployeeCredentials(req: CustomRequest, res: Response): Promise<void>;
    getEmployeeDocuments(req: CustomRequest, res: Response): Promise<void>;
    getEmployee(req: CustomRequest, res: Response): Promise<void>;
    updateProfilePicture(req: CustomRequest, res: Response): Promise<void>;
    updateResume(req: CustomRequest, res: Response): Promise<void>;
    updateBlocking(req: CustomRequest, res: Response): Promise<void>;
    getEmployeeWithOutDepartment(req: CustomRequest, res: Response): Promise<void>;
    removeEmployee(req: CustomRequest, res: Response): Promise<void>;
    updateCredentials(req: CustomRequest, res: Response): Promise<void>;
} 