import { Request, Response, NextFunction } from 'express';
import { generateAccessToken, generateRefreshToken } from '../../utils/businessOwnerJWT';
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
            const { accessToken, refreshToken } = response;

            console.log("accessToken fron superAdminController", accessToken.slice(0, 10));
            console.log("accessToken fron superAdminController", refreshToken.slice(0, 10));
            

            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
            });
            res.cookie('accessToken', accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
            });
            return res.status(200).json({ accessToken: accessToken });
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

   async setNewAccessToken (req: Request, res: Response): Promise<Response> {
    console.log("setNewAccessToken calinn-------------------------------",);
    
        try {
            const refreshToken = req.cookies.refreshToken;
            const newAccessToken = await this.adminService.setNewAccessToken(refreshToken);
            return res.status(200).json({ accessToken: newAccessToken });
        } catch (error: unknown) {
            if (error instanceof Error) {
                return res.status(400).json({ message: error.message });
            } else {
                return res.status(500).json({ message: 'An unexpected error occurred.' });
            }
        }
    }
}
