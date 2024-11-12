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
        console.log(`"Hitting the setNewAccessToken from businessOwner controller"`.bgMagenta);
        
        try {
            const refreshToken = req.cookies.refreshToken;
            const newAccessToken = await this.businessOwnerService.setNewAccessToken(refreshToken);
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
