import {  NextFunction, Request, Response } from "express";
  export default interface IBusinessOwnerController {
    register(req: Request, res: Response , next: NextFunction):Promise<void>;
    login(req: Request, res: Response ): Promise<Response>;
    validateOtp(req: Request, res: Response,next: NextFunction): Promise<void>;
    resendOtp(req: Request, res: Response): Promise<Response>;
    forgotPassword(req: Request, res: Response): Promise<Response>;
    addNewPassword(req: Request, res: Response): Promise<Response>;
    googleLogin(req: Request, res: Response): Promise<Response>;
  }


