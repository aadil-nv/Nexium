import { NextFunction, Request, Response } from "express";
import IManagerController from "../interface/IManagerController";
import IManagerService from "../../service/interfaces/IManagerService";
import { inject, injectable } from "inversify";
import { HttpStatusCode } from "../../utils/statusCodes";

@injectable()
export default class ManagerController implements IManagerController {
    constructor(@inject("IManagerService") private _managerService: IManagerService) {}

    private setCookies(res: Response, accessToken: string, refreshToken: string): void {
        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 7 * 24 * 3600 * 1000, // 7 days
            sameSite: "strict" as const, // Explicitly specify "strict"
        };
        res.cookie('accessToken', accessToken, cookieOptions);
        res.cookie('refreshToken', refreshToken, cookieOptions);
    }
    

    async managerLogin(req: Request, res: Response): Promise<Response> {
        try {
            const { email, password } = req.body;
            const result = await this._managerService.managerLogin(email, password);

            if (!result.success && !result.isVerified) {
                return res.status(HttpStatusCode.OK).json({
                    success: false,
                    message: result.message,
                    email: result.email,
                    isVerified: result.isVerified,
                });
            }

            if (result.accessToken && result.refreshToken) {
                this.setCookies(res, result.accessToken, result.refreshToken);
            }

            return res.status(HttpStatusCode.ACCEPTED).json({
                message: "Login successful",
                data: result,
                success: true,
            });
        } catch (error) {
            console.error("Login error:", error);
            const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
            return res.status(HttpStatusCode.BAD_REQUEST).json({ message: errorMessage, error: true });
        }
    }

    async validateOtp(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { email, otp } = req.body;
            const response = await this._managerService.validateOtp(email, otp);

            if (response.success) {
                this.setCookies(res, response.accessToken, response.refreshToken);
                res.status(HttpStatusCode.OK).json({
                    success: true,
                    message: response.message,
                    email: response.email,
                    accessToken: response.accessToken,
                    refreshToken: response.refreshToken,
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
            console.error("Error resending OTP:", error);
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: "Internal Server Error" });
        }
    }
}
