import { NextFunction, Request, Response } from "express";
import IEmployeeController from "../interface/IEmployeeController";
import IEmployeeService from "../../service/interfaces/IEmployeeService";
import { inject, injectable } from "inversify";


@injectable()
export default class EmployeeController implements IEmployeeController {
    private _employeeService: IEmployeeService;
    constructor(@inject("IEmployeeService") employeeService: IEmployeeService) {
        this._employeeService = employeeService;
    }

    async employeeLogin(req: Request, res: Response): Promise<Response> {
        console.log("huitting employeeLogin==================.====>");
        console.log("email, passowrd fro controller",req.body);
        
        
       try {
        const { email, password } = req.body;
        const result = await this._employeeService.employeeLogin(email, password);
        return res.status(200).json(result);
        
       } catch (error:any) {
        console.error('Error during employee login:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
        
       }
    }

    async validateOtp(req: Request, res: Response, next: NextFunction): Promise<void> {
        console.log("Validating OTP...");

        try {
            const { email, otp } = req.body;
            console.log("Email:", email, "OTP:", otp);
            
            const response = await this._employeeService.validateOtp(email, otp);
            console.log("OTP validation response:", response);

            if (response.success) {
                res.cookie('accessToken', response.accessToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production', maxAge:7 * 24 * 3600 * 1000 });
                res.cookie('refreshToken', response.refreshToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production', maxAge: 7 * 24 * 3600 * 1000 }); // 7 days

                res.status(200).json({
                    success: true,
                    message: response.message,
                    email: response.email,
                    accessToken: response.accessToken,
                    refreshToken: response.refreshToken,
                });
            } else {
                res.status(400).json({
                    success: false,
                    message: response.message || "OTP validation failed.",
                });
            }
        } catch (error) {
            console.error("Error validating OTP:", error);
            next(error);
        }
    }


}