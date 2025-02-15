import { Request, Response, NextFunction } from 'express';
import { generateAccessToken, generateRefreshToken } from '../../utils/jwt';
import ISuperAdminController from '../interface/ISuperAdminController';
import ISuperAdminService from '../../service/interfaces/ISuperAdminService';
import { inject, injectable } from "inversify";
import { HttpStatusCode } from '../../utils/enums';

@injectable()
export default class SuperAdminController implements ISuperAdminController {
    
    private _adminService: ISuperAdminService;

    constructor(@inject("ISuperAdminService") adminService: ISuperAdminService) {
        this._adminService = adminService;
    }

    async adminLogin(req: Request, res: Response, next: NextFunction): Promise<Response> {
        try {
            const { email, password } = req.body;
            const { accessToken, refreshToken } = await this._adminService.login(email, password);

            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000
            });

            res.cookie('accessToken', accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge:7 * 24 * 60 * 60 * 1000
            });

            return res.status(HttpStatusCode.OK).json({ accessToken });
        } catch (error: unknown) {
            return res.status(error instanceof Error ? HttpStatusCode.BAD_REQUEST : HttpStatusCode.INTERNAL_SERVER_ERROR).json({
                message: error instanceof Error ? error.message : 'An unexpected error occurred.',
            });
        }
    }

    async adminRegister(req: Request, res: Response): Promise<Response> {
        try {
            const { username, email, password } = req.body;
            const newAdmin = await this._adminService.register(username, email, password);
            
            const accessToken = generateAccessToken(newAdmin);
            const refreshToken = generateRefreshToken(newAdmin);

            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
            });

            return res.status(HttpStatusCode.CREATED).json({ accessToken, admin: newAdmin });
        } catch (error: unknown) {
            return res.status(error instanceof Error ? HttpStatusCode.BAD_REQUEST : HttpStatusCode.INTERNAL_SERVER_ERROR).json({
                message: error instanceof Error ? error.message : 'An unexpected error occurred.',
            });
        }
    }

    async setNewAccessToken(req: Request, res: Response): Promise<Response> {
        try {
            const refreshToken = req.cookies.refreshToken;
            const newAccessToken = await this._adminService.setNewAccessToken(refreshToken);
            return res.status(200).json({ accessToken: newAccessToken });
        } catch (error: unknown) {
            return res.status(error instanceof Error ? HttpStatusCode.BAD_REQUEST : HttpStatusCode.INTERNAL_SERVER_ERROR).json({
                message: error instanceof Error ? error.message : 'An unexpected error occurred.',
            });
        }
    }
}
