import { NextFunction, Request, Response } from "express";


export default interface ISuperAdminController {
    adminLogin(req: Request, res: Response, next: NextFunction): Promise<Response | void>;
    adminRegister(req: Request, res: Response): Promise<Response>;
    // refreshAccessToken(req: Request, res: Response): Promise<Response>;
   
}