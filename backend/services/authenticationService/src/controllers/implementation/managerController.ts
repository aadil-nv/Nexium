import { NextFunction, Request, Response } from "express";
import IManagerController from "../interface/IManagerController";
import IManagerService from "../../service/interfaces/IManagerService";
import { inject, injectable } from "inversify";
import { HttpStatusCode } from "../../utils/statusCodes";

@injectable()
export default class ManagerController implements IManagerController {
    private _managerService: IManagerService;

    constructor(@inject("IManagerService") managerService: IManagerService) {
        this._managerService = managerService;
    }

    async managerLogin(req: Request, res: Response): Promise<Response> {
        try {
            const result = await this._managerService.managerLogin(req.body.email, req.body.password);
            
            if (!result.success && !result.isVerified) {
                return res.status(HttpStatusCode.OK).json({
                    success: false,
                    message: result.message,
                    email: result.email,
                    isVerified: result.isVerified,
                });
            }

            if (result.accessToken && result.refreshToken) {
                res.cookie('accessToken', result.accessToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    maxAge: 7 * 24 * 60 * 60 * 1000,
                    sameSite: 'strict',
                });

                res.cookie('refreshToken', result.refreshToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    maxAge: 7 * 24 * 60 * 60 * 1000,
                    sameSite: 'strict',
                });
            }

            return res.status(HttpStatusCode.ACCEPTED ).json({
                message: "Login successful",
                data: result,
                success: true,
            });
        } catch (error: unknown) {
            console.error('Login error:', error);
            const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
            return res.status(HttpStatusCode.BAD_REQUEST).json({ message: errorMessage, error: true });
        }
    }

    async validateOtp(req: Request, res: Response, next: NextFunction): Promise<void> {
        console.log("Validating OTP...");

        try {
            const { email, otp } = req.body;
            console.log("Email:", email, "OTP:", otp);

            const response = await this._managerService.validateOtp(email, otp);
            console.log("OTP validation response:", response);

            if (response.success) {
                res.cookie('accessToken', response.accessToken, { 
                    httpOnly: true, 
                    secure: process.env.NODE_ENV === 'production', 
                    maxAge: 7 * 24 * 3600 * 1000 
                });
                res.cookie('refreshToken', response.refreshToken, { 
                    httpOnly: true, 
                    secure: process.env.NODE_ENV === 'production', 
                    maxAge: 7 * 24 * 3600 * 1000 
                }); // 7 days

                res.status(HttpStatusCode.OK).json({
                    success: true,
                    message: response.message,
                    email: response.email,
                    data:response

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
            const result = await this._managerService.resendOtp(email);
            return res.status(HttpStatusCode.OK).json(result);
        } catch (error) {
            console.error('Error resending OTP:', error);
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Internal Server Error' });
        }
    }
}
