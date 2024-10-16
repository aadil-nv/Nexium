
import { Request, Response } from 'express';
import AdminService from '../Services/implementaion/adminService';
import { generateAccessToken, generateRefreshToken } from '../Utils/jwt';
import { IExtendedLoginResponse, IAdmin } from '../entities/adminEntity';

class AdminController {
   
    async adminLogin(req: Request, res: Response): Promise<Response> {
        const { email, password } = req.body;

        try {
            const response: IExtendedLoginResponse = await AdminService.login(email, password);
            const { token, refreshToken, admin } = response;

            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
            });

            return res.status(200).json({ accessToken: token, admin });
        } catch (error: unknown) {
            if (error instanceof Error) {
                return res.status(400).json({ message: error.message });
            } else {
                return res.status(500).json({ message: 'An unexpected error occurred.' });
            }
        }
    }

    async adminRegister(req: Request, res: Response): Promise<Response> {
        const { username, email, password } = req.body;
            console.log("adminController is touched.......");
            
        try {
            const newAdmin: Omit<IAdmin, 'password'> = await AdminService.register(username, email, password);
            console.log("adminController - newAdmin data",newAdmin);
            
            const accessToken = generateAccessToken(newAdmin); 
            const refreshToken = generateRefreshToken(newAdmin);


            console.log("Refresh token" ,refreshToken,);
            console.log("Access token" ,accessToken,);
            
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
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

    async refreshAccessToken(req: Request, res: Response): Promise<Response> {
        const { refreshToken } = req.cookies;

        if (!refreshToken) {
            return res.status(401).json({ message: 'No refresh token provided.' });
        }

        try {
            const admin = await AdminService.verifyRefreshToken(refreshToken); 

            if (!admin) {
                return res.status(403).json({ message: 'Invalid refresh token.' });
            }

            const newAccessToken = generateAccessToken(admin); 

            return res.status(200).json({ accessToken: newAccessToken });
        } catch (error: unknown) {
            if (error instanceof Error) {
                return res.status(403).json({ message: error.message });
            } else {
                return res.status(500).json({ message: 'An unexpected error occurred.' });
            }
        }
    }

    async logout(req: Request, res: Response): Promise<Response> {
        res.clearCookie('refreshToken'); 
        return res.status(200).json({ message: 'Logged out successfully.' });
    }
}

export default new AdminController();
