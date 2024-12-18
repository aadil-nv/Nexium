import { Request, Response, NextFunction } from 'express';
import { generateAccessToken, generateRefreshToken } from '../../utils/businessOwnerJWT';
import ISuperAdminController from '../interface/ISuperAdminController';
import ISuperAdminService from '../../service/interfaces/ISuperAdminService';
import { inject, injectable } from "inversify";
import { HttpStatusCode } from "../../utils/statusCodes";


@injectable()
export default class SuperAdminController implements ISuperAdminController {
    constructor(@inject("ISuperAdminService") private _adminService: ISuperAdminService) {}

    private setCookies(res: Response, accessToken: string, refreshToken: string): void {
        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict' as const,
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        };
        res.cookie('accessToken', accessToken, cookieOptions);
        res.cookie('refreshToken', refreshToken, cookieOptions);
    }

    private handleError(res: Response, error: unknown): Response {
        const message = error instanceof Error ? error.message : 'An unexpected error occurred.';
        const status = error instanceof Error ? HttpStatusCode.BAD_REQUEST : HttpStatusCode.INTERNAL_SERVER_ERROR;
        return res.status(status).json({ message });
    }

    async adminLogin(req: Request, res: Response): Promise<Response> {
        try {
            const { email, password } = req.body;
            const { accessToken, refreshToken } = await this._adminService.login(email, password);
            this.setCookies(res, accessToken, refreshToken);
            return res.status(HttpStatusCode.OK).json({ accessToken });
        } catch (error) {
            return this.handleError(res, error);
        }
    }

    async adminRegister(req: Request, res: Response): Promise<Response> {
        try {
            const { username, email, password } = req.body;
            const newAdmin = await this._adminService.register(username, email, password);
            const accessToken = generateAccessToken(newAdmin);
            const refreshToken = generateRefreshToken(newAdmin);
            this.setCookies(res, accessToken, refreshToken);
            return res.status(HttpStatusCode.CREATED).json({ accessToken, admin: newAdmin });
        } catch (error) {
            return this.handleError(res, error);
        }
    }

    async setNewAccessToken(req: Request, res: Response): Promise<Response> {
        try {
            const refreshToken = req.cookies.refreshToken;
            const newAccessToken = await this._adminService.setNewAccessToken(refreshToken);
            return res.status(HttpStatusCode.OK).json({ accessToken: newAccessToken });
        } catch (error) {
            return this.handleError(res, error);
        }
    }
}
