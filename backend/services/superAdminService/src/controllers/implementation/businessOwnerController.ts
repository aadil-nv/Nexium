import { Request, Response } from 'express';
import IBusinessOwnerController from "../interface/IBusinessOwnerController";
import IBusinessOwnerService from "../../service/interface/IBusinessOwnerService";
import { inject, injectable } from 'inversify';
import { HttpStatusCode } from '../../utils/httpStatusCodes';

@injectable()
export default class BusinessOwnerController implements IBusinessOwnerController {
  
    private _businessOwnerService: IBusinessOwnerService;

    constructor(@inject("IBusinessOwnerService") businessOwnerService: IBusinessOwnerService) {
        this._businessOwnerService = businessOwnerService;
    }

    async fetchAllBusinessOwners(req: Request, res: Response): Promise<Response> {
        try {
            const businessOwners = await this._businessOwnerService.fetchAllBusinessOwners();
            return res.status(HttpStatusCode.OK).json({ businessOwners });
        } catch (error) {
            console.error(error);
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: "Error while fetching business owners" });
        }
    }

    async updateIsBlocked(req: Request, res: Response): Promise<Response> {
        
        const { id } = req.params;
        try {
            const updatedBusinessOwner = await this._businessOwnerService.updateIsBlocked(id);
            return res.status(HttpStatusCode.OK).json({ updatedBusinessOwner });
        } catch (error) {
            console.error(error);
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: "Error while updating block status" });
        }
    }

    async setNewAccessToken(req: Request, res: Response): Promise<Response> {
        try {
            const refreshToken = req.cookies.refreshToken;

            if (!refreshToken) {
                return res.status(HttpStatusCode.UNAUTHORIZED).json({ message: 'Refresh token is missing.' });
            }

            const newAccessToken = await this._businessOwnerService.setNewAccessToken(refreshToken);

            if (!newAccessToken) {
                return res.status(HttpStatusCode.FORBIDDEN).json({ message: 'Failed to generate a new access token.' });
            }

            res.cookie('accessToken', newAccessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 1000 * 60 * 15,
            });

            return res.status(HttpStatusCode.OK).json({ accessToken: newAccessToken });

        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error("Error occurred:", error.message);
                return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: error.message });
            }
            console.error("Unexpected error occurred.");
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: 'An unexpected error occurred.' });
        }
    }
}
