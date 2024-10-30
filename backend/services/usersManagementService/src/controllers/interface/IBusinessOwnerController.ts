import { Request, Response } from "express";

export default interface IBusinessOwnerController {
    addManagers(req: Request, res: Response): Promise<Response>;
    findAllManagers(req: Request, res: Response): Promise<Response>;
}
