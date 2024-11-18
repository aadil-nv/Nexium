import { Request, Response } from "express";
export default interface IManagerController {
    getManagers(req: Request, res: Response): Promise<Response>;
}