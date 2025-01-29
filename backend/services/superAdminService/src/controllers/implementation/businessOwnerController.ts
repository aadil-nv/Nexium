import { Request, Response } from 'express';
import IBusinessOwnerController from "../interface/IBusinessOwnerController";
import IBusinessOwnerService from "../../service/interface/IBusinessOwnerService";
import { inject, injectable } from 'inversify';

@injectable()
export default class BusinessOwnerController implements IBusinessOwnerController {
  
    private _businessOwnerService: IBusinessOwnerService;

    constructor(@inject("IBusinessOwnerService") businessOwnerService: IBusinessOwnerService) {
        this._businessOwnerService = businessOwnerService;
    }

    async fetchAllBusinessOwners(req: Request, res: Response): Promise<Response> {
        try {
            const businessOwners = await this._businessOwnerService.fetchAllBusinessOwners();
            return res.status(200).json({ businessOwners });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Error while fetching business owners" });
        }
    }

    async updateIsBlocked(req: Request, res: Response): Promise<Response> {
        
        const { id } = req.params;
        try {
            const updatedBusinessOwner = await this._businessOwnerService.updateIsBlocked(id);
            return res.status(200).json({ updatedBusinessOwner });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Error while updating block status" });
        }
    }

    async setNewAccessToken(req: Request, res: Response): Promise<Response> {
        try {
            const refreshToken = req.cookies.refreshToken;

            if (!refreshToken) {
                return res.status(400).json({ message: 'Refresh token is missing.' });
            }

            const newAccessToken = await this._businessOwnerService.setNewAccessToken(refreshToken);

            if (!newAccessToken) {
                return res.status(403).json({ message: 'Failed to generate a new access token.' });
            }

            res.cookie('accessToken', newAccessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 1000 * 60 * 15,
            });

            return res.status(200).json({ accessToken: newAccessToken });

        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error("Error occurred:", error.message);
                return res.status(403).json({ message: error.message });
            }
            console.error("Unexpected error occurred.");
            return res.status(500).json({ message: 'An unexpected error occurred.' });
        }
    }
}
