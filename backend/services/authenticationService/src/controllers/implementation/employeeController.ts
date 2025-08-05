import { NextFunction, Request, Response } from "express";
import IEmployeeController from "../interface/IEmployeeController";
import IEmployeeService from "../../service/interfaces/IEmployeeService";
import { inject, injectable } from "inversify";
import { HttpStatusCode } from "../../utils/enums";


@injectable()
export default class EmployeeController implements IEmployeeController {
    private _employeeService: IEmployeeService;
    constructor(@inject("IEmployeeService") employeeService: IEmployeeService) {
        this._employeeService = employeeService;
    }

    async employeeLogin(req: Request, res: Response): Promise<Response> {
        console.log("email, passowrd fro controller",req.body);
       try {
        const { email, password } = req.body;
        const result = await this._employeeService.employeeLogin(email, password);
        res.cookie('accessToken', result.accessToken, 
            { httpOnly: true, secure: process.env.NODE_ENV === 'production', maxAge:Number(process.env.MAX_AGE) });
        res.cookie('refreshToken', result.refreshToken, 
            { httpOnly: true, secure: process.env.NODE_ENV === 'production', maxAge: Number(process.env.MAX_AGE) }); // 7 days
        return res.status(HttpStatusCode.OK).json(result);
        
       } catch (error:any) {
        console.error('Error during employee login:', error);
        return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Internal Server Error' });
        
       }
    }

    async validateOtp(req: Request, res: Response, next: NextFunction): Promise<void> {
        console.log("Validating OTP...");
        try {
            const { email, otp } = req.body;
            console.log("Email:", email, "OTP:", otp);
            
            const response = await this._employeeService.validateOtp(email, otp);
            if (response.success) {
                res.cookie('accessToken', response.accessToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production', maxAge:Number(process.env.MAX_AGE) });
                res.cookie('refreshToken', response.refreshToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production', maxAge: Number(process.env.MAX_AGE) }); // 7 days
                res.status(HttpStatusCode.OK).json({
                    success: true,
                    message: response.message,
                    email: response.email,
                    response 
                });
            } else {
                res.status(HttpStatusCode.BAD_REQUEST).json({
                    success: false,
                    message: response.message || "OTP validation failed.",
                });
            }
        } catch (error) {
            console.error("Error validating OTP:", error);
            next(error);
        }
    }

    async resendOtp(req: Request, res: Response): Promise<Response> {
        try {
          const { email } = req.body;
          const result = await this._employeeService.resendOtp(email);
          return res.status(HttpStatusCode.OK).json(result);
        } catch (error) {
          console.error('Error resending OTP:', error);
          return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Internal Server Error' });
        }
      }


}