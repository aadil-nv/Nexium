import { NextFunction, Request, Response } from "express";
export default interface IManagerController {
    managerLogin(req: Request, res: Response): Promise<Response>;
    validateOtp(req: Request, res: Response ,next: NextFunction): Promise<void>;
}


