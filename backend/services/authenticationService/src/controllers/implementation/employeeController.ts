import { NextFunction, Request, Response } from "express";
import IEmployeeController from "../interface/IEmployeeController";
import IEmployeeService from "../../service/interfaces/IEmployeeService";
import { inject, injectable } from "inversify";
import { HttpStatusCode } from "axios";


@injectable()
export default class EmployeeController implements IEmployeeController {
    private _employeeService: IEmployeeService;
    constructor(@inject("IEmployeeService") employeeService: IEmployeeService) {
        this._employeeService = employeeService;
    }

    async employeeLogin(req: Request, res: Response): Promise<Response> {
        console.log("Hitting employeeLogin==================>");
        console.log("Email and password from controller:", req.body);
    
        try {
            const { email, password } = req.body;
    
            // Call the service method
            const result = await this._employeeService.employeeLogin(email, password);
            
            console.log("result message from 777777777777777", result);
    
            if (!result.success) {
                console.log("result message from controller000000000000", result.message);
                
                return res.status(HttpStatusCode.BadRequest).json(result);
            }
            if(!result.accessToken || !result.refreshToken) {
                return res.status(HttpStatusCode.BadRequest).json(result);
            }

        console.log("acccessToken " , result.accessToken);
        console.log("refreshToken " , result.refreshToken);
        
            
            res.cookie('accessToken', result.accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 7 * 24 * 3600 * 1000, // 7 day
            });
            res.cookie('refreshToken', result.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 7 * 24 * 3600 * 1000, // 7 day
            })
            console.log("cokkit setted successfully");
            
    
            return res.status(HttpStatusCode.Accepted).json(result);
        } catch (error: any) {
            console.error('Error during employee login:', error.message);
            return res.status(HttpStatusCode.InternalServerError).json({ message: "An unexpected error occurred. Please try again later." });
        }
    }
    

    async validateOtp(req: Request, res: Response, next: NextFunction): Promise<Response> {
        console.log("Validating OTP...");
        console.log("Email and OTP from controller:", req.body);
    
        try {
            const { email, otp } = req.body;
    
            // Validate OTP through service
            const response = await this._employeeService.validateOtp(email, otp);
            console.log("OTP validation response:", response);
    
            if (response.success) {
                // Set cookies for access and refresh tokens
                res.cookie('accessToken', response.accessToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    maxAge: 7 * 24 * 3600 * 1000, // 7 days
                });
                res.cookie('refreshToken', response.refreshToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    maxAge: 7 * 24 * 3600 * 1000, // 7 days
                });
    
                // Respond with success
                return res.status(200).json({
                    success: true,
                    message: response.message,
                    email: response.email,
                    accessToken: response.accessToken,
                    refreshToken: response.refreshToken,
                });
            } 
    
            // Respond with failure
            return res.status(400).json({
                success: false,
                message: response.message || "OTP validation failed. Please try again.",
            });
        } catch (error: any) {
            console.error("Error validating OTP:", error.message);
            // Send a consistent error message
            return res.status(500).json({
                success: false,
                message: "An unexpected error occurred while validating OTP. Please try again.",
            });
        }
    }

    async resendOtp(req: Request, res: Response): Promise<Response> {
        try {
          const { email } = req.body;
          const result = await this._employeeService.resendOtp(email);
          return res.status(200).json(result);
        } catch (error) {
          console.error('Error resending OTP:', error);
          return res.status(500).json({ message: 'Internal Server Error' });
        }
      }
    



}