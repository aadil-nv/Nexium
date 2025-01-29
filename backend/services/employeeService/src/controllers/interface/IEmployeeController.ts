import { Request, Response } from "express";
import { CustomRequest } from "../../middlewares/tokenAuth";
export default interface IEmployeeController {
    setNewAccessToken(req: Request, res: Response): Promise<Response>;
    logout(req: Request, res: Response): Promise<Response>;
    getProfile(req: CustomRequest, res: Response): Promise<Response>;
    getPersonalInfo(req: CustomRequest, res: Response): Promise<Response>;
    updateProfile(req: CustomRequest, res: Response): Promise<Response>;
    updateProfilePicture(req: CustomRequest, res: Response): Promise<Response>;
    getAddress(req: CustomRequest, res: Response): Promise<Response>;
    updateAddress(req: CustomRequest, res: Response): Promise<Response>;
    getEmployeeProfessionalInfo(req: CustomRequest, res: Response): Promise<Response>;
    getDocuments(req: CustomRequest, res: Response): Promise<Response>;
    updateDocuments(req: CustomRequest, res: Response): Promise<Response>;
    getEmployeeCredentials(req: CustomRequest, res: Response): Promise<Response>;

}