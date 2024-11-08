import { Request, Response, NextFunction } from 'express';
import { generateAccessToken, generateRefreshToken } from '../../utils/jwt';
import ISuperAdminController from '../interface/ISuperAdminController';
import ISuperAdminService from '../../service/interfaces/ISuperAdminService'; // Adjust path as necessary
import { inject, injectable } from "inversify";

@injectable()
export default class SuperAdminController implements ISuperAdminController {
    
    private adminService: ISuperAdminService;

    constructor(@inject("ISuperAdminService") adminService: ISuperAdminService) {
        this.adminService = adminService;
    }


  async adminLogin(req: Request, res: Response, next: NextFunction) {
    console.log("super adminnnnnnnnnnnnnnnnnnnnn");
    
        try {
            const { email, password } = req.body;            
            const response= await this.adminService.login(email, password);
            const { token, refreshToken } = response;

            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
            });
            return res.status(200).json({ accessToken: token });
        } catch (error: unknown) {
            if (error instanceof Error) {
                return res.status(400).json({ message: error.message });
            } else {
                return res.status(500).json({ message: 'An unexpected error occurred.' });
            }
        }
    }

    

    async adminRegister(req: Request, res: Response): Promise<Response> {

        try {
            const { username, email, password } = req.body;
            const newAdmin = await this.adminService.register(username, email, password);
            
            const accessToken = generateAccessToken(newAdmin);
            const refreshToken = generateRefreshToken(newAdmin);

            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000 
            });

            return res.status(201).json({ accessToken, admin: newAdmin });
        } catch (error: unknown) {
            if (error instanceof Error) {
                return res.status(400).json({ message: error.message });
            } else {
                return res.status(500).json({ message: 'An unexpected error occurred.' });
            }
        }
    }

    // Uncomment this if you need the refresh token route
    // async refreshAccessToken(req: Request, res: Response): Promise<Response> {
    //     const { refreshToken } = req.cookies;

    //     if (!refreshToken) {
    //         return res.status(401).json({ message: 'No refresh token provided.' });
    //     }

    //     try {
    //         const admin = await this.adminService.verifyRefreshToken(refreshToken);

    //         if (!admin) {
    //             return res.status(403).json({ message: 'Invalid refresh token.' });
    //         }

    //         const newAccessToken = generateAccessToken(admin);
    //         return res.status(200).json({ accessToken: newAccessToken });
    //     } catch (error: unknown) {
    //         if (error instanceof Error) {
    //             return res.status(403).json({ message: error.message });
    //         } else {
    //             return res.status(500).json({ message: 'An unexpected error occurred.' });
    //         }
    //     }
    // }
}
