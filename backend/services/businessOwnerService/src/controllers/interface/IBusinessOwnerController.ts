import { Request, Response } from "express";

export default interface IBusinessOwnerController {
    findAllManagers(req: Request, res: Response): Promise<Response>;
    addManagers(req: Request, res: Response): Promise<Response>;
    setNewAccessToken(req: Request, res: Response): Promise<Response>;
}
