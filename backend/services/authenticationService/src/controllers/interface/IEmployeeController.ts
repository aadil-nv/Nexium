import { NextFunction, Request,Response } from "express";

export default interface IEmployeeController {
    employeeLogin(req: Request, res: Response): Promise<Response>
    validateOtp(req: Request, res: Response, next: NextFunction): Promise<void>
    resendOtp(req: Request, res: Response): Promise<Response>

}