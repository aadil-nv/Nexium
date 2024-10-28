import { Request, Response } from "express";

export default interface IBusinessOwnerController {
    addManagers(req: Request, res: Response): Promise<Response>;
    findAllCompanies(req: Request, res: Response): Promise<Response>;
}
