import { NextFunction, Request, Response } from "express";
import IEmployeeController from "../interface/IEmployeeController";
import IEmployeeService from "../../service/interfaces/IEmployeeService";
import { inject, injectable } from "inversify";
import { HttpStatusCode } from "axios";

@injectable()
export default class EmployeeController implements IEmployeeController {
    constructor(@inject("IEmployeeService") private _employeeService: IEmployeeService) {}

    private setCookies(res: Response, accessToken: string, refreshToken: string): void {
        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 7 * 24 * 3600 * 1000, // 7 days
            sameSite: "strict" as const
        };
        res.cookie('accessToken', accessToken, cookieOptions);
        res.cookie('refreshToken', refreshToken, cookieOptions);
    }

    async employeeLogin(req: Request, res: Response): Promise<Response> {
        console.log("hitting here ======================================");
        
        try {
            const { email, password } = req.body;
            const result = await this._employeeService.employeeLogin(email, password);

            if (!result.success || !result.accessToken || !result.refreshToken) {
                return res.status(HttpStatusCode.BadRequest).json(result);
            }

            this.setCookies(res, result.accessToken, result.refreshToken);
            return res.status(HttpStatusCode.Accepted).json(result);
        } catch (error: any) {
            console.error('Error during employee login:', error.message);
            return res.status(HttpStatusCode.InternalServerError).json({ message: "An unexpected error occurred. Please try again later." });
        }
    }

    async validateOtp(req: Request, res: Response): Promise<Response> {
        try {
            const { email, otp } = req.body;
            const response = await this._employeeService.validateOtp(email, otp);
            if(!response.accessToken || !response.refreshToken || !response.message ||!response.email){
                return res.status(HttpStatusCode.BadRequest).json(response);
            }

            if (response.success) {
                this.setCookies(res, response.accessToken, response.refreshToken);
                return res.status(200).json({success: true,...response,});
            }

            return res.status(400).json({
                success: false,
                message: response.message || "OTP validation failed. Please try again.",
            });
        } catch (error: any) {
            console.error("Error validating OTP:", error.message);
            return res.status(500).json({ message: "An unexpected error occurred while validating OTP. Please try again." });
        }
    }

    async resendOtp(req: Request, res: Response): Promise<Response> {
        try {
            const { email } = req.body;
            const result = await this._employeeService.resendOtp(email);
            return res.status(200).json(result);
        } catch (error: any) {
            console.error('Error resending OTP:', error.message);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    }
}
