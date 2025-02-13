import { Request, Response } from "express";
import {CustomRequest} from '../../middlewares/tokenAuthenticate'
export default interface IManagerController {
    getManagers(req: CustomRequest, res: Response): Promise<Response>;
    getManagerPersonalInfo(req: CustomRequest, res: Response): Promise<Response>;
    getManagerProfessionalInfo(req: CustomRequest, res: Response): Promise<Response>;
    getManagerAddress(req: CustomRequest, res: Response): Promise<Response>;
    getManagerDocuments(req: CustomRequest, res: Response): Promise<Response>;
    getManagerCredentials(req: CustomRequest, res: Response): Promise<Response>;
    updateManagerPersonalInfo( req: CustomRequest, res: Response): Promise<Response>;
    setNewAccessToken(req: CustomRequest, res: Response): Promise<Response> 
    logout(req: CustomRequest, res: Response): Promise<Response>
    updateManagerProfilePicture(req: CustomRequest, res: Response): Promise<Response>
    getLeaveEmployees(req: CustomRequest, res: Response): Promise<Response>
    updateManagerAddress(req: CustomRequest, res: Response): Promise<Response>
    updateDocuments(req: CustomRequest, res: Response): Promise<Response>
    updateManagerIsActive(req: CustomRequest, res: Response): Promise<Response>
}