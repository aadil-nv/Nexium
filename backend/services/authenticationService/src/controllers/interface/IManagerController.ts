import { Request, Response } from "express";
export default interface IManagerController {
    managerLogin(req: Request, res: Response): Promise<Response>;
}


