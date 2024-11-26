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
    

}