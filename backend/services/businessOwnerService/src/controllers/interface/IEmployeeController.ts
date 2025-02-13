import { Request, Response } from "express";
import { CustomRequest } from "../../middlewares/authMiddleware";
export default interface IEmployeeController {
    getProfile(req:CustomRequest, res:Response): Promise<Response>;
    getAllEmployees(req:CustomRequest, res:Response): Promise<Response>;
    addEmployee(req:CustomRequest, res:Response): Promise<Response>;
    blockEmployee(req:CustomRequest, res:Response): Promise<Response>;
    removeEmployee(req:CustomRequest, res:Response): Promise<Response>;
    updatePersonalInfo(req:CustomRequest, res:Response): Promise<Response>;
    updateProfessionalInfo(req:CustomRequest, res:Response): Promise<Response>;
    updateAddressInfo(req:CustomRequest, res:Response): Promise<Response>;
    updateSecurityInfo(req:CustomRequest, res:Response): Promise<Response>;
    uploadProfilePic(req:CustomRequest, res:Response): Promise<Response>;
    
}