import { Request, Response } from "express";

export default interface ISuperAdminController {
    setNewAccessToken(req: Request, res: Response): Promise<Response>;
    logout(req: Request, res: Response): Promise<Response>;
    getAllServiceRequest(req: Request, res: Response): Promise<Response>;
    updateServiceRequestStatus(req: Request, res: Response): Promise<Response>;
}