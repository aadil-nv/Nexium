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

   
    async findAllManagers(req: Request, res: Response): Promise<Response> {
        console.log("hittimg the findAllManagers Schema 1==============");
        
        try {
            const comapanyId = (req as any).user?.updatedCompany._id;
            const managers = await this.businessOwnerService.findAllManagers(comapanyId);
            console.log("managers:", managers);
            
            return res.status(200).json(managers); 
        } catch (error) {
            console.error("Error fetching registered companies:", error);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }

    async addManagers(req: Request, res: Response): Promise<Response> {
        try {
            const managerData = req.body  
            const businessOwnerId = (req as any).user?.updatedCompany._id;
            console.log("companyId:", businessOwnerId);
            
            await this.businessOwnerService.addManagers(managerData, businessOwnerId);
            console.log("Hitting the addManager Schema 5");
            return res.status(201).json({ message: "Successfully added HR Manager" });
        } catch (error) {
            console.error("Error adding HR Manager:", error);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }

    async setNewAccessToken (req: Request, res: Response): Promise<Response> {
        console.log("setNewAccessToken calinn---------------controller----------------",);
        
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
