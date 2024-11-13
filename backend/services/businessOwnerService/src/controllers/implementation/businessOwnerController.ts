import { Request, Response } from "express";
import BusinessOwnerService from "../../service/implementation/businessOwnerService";
import IManager from "../../entities/managerEntity";
import IBusinessOwnerController from "../interface/IBusinessOwnerController";
import IBusinessOwnerService from "../../service/interface/IBusinessOwnerService";
import { inject, injectable } from "inversify";

@injectable()
export default class BusinessOwnerController implements IBusinessOwnerController {
    private businessOwnerService: IBusinessOwnerService;

    constructor(@inject("IBusinessOwnerService") businessOwnerService: BusinessOwnerService) {
        this.businessOwnerService = businessOwnerService;
    }

    async setNewAccessToken(req: Request, res: Response): Promise<Response> {
        console.log("setNewAccessToken is caling  %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%");
        try {
            const refreshToken = req.cookies.refreshToken;
            if (!refreshToken) return res.status(400).json({ message: 'Refresh token missing.' });
    
            const newAccessToken = await this.businessOwnerService.setNewAccessToken(refreshToken);
            if (!newAccessToken) return res.status(401).json({ message: 'Failed to generate new access token.' });
        
            res.cookie('accessToken', newAccessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 3600000,
                sameSite: 'strict',
            });
            console.log(`"===========newAccessToken seetted-----"`.bgRed, newAccessToken);
    
            return res.status(200).json({ accessToken: newAccessToken });
    
        } catch {
            return res.status(401).json({ message: 'An unexpected error occurred.' });
        }
    }
    
    async logout(req: Request, res: Response): Promise<Response> {
        try {
            res.clearCookie('accessToken');
            res.clearCookie('refreshToken');
            return res.status(200).json({ message: 'Logout successful' });
        } catch (error) {
            console.error('Logout error:', error);
            return res.status(500).json({ error: 'Logout failed' });
        }
    }
    

}
