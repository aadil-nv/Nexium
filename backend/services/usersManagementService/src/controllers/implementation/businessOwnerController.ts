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

    // Method to fetch all registered companies
    async findAllCompanies(req: Request, res: Response): Promise<Response> {
        try {
            const companies = await this.businessOwnerService.findAllCompanies();
            // console.log("Registered Companies:", companies);
            return res.status(200).json(companies); // Return the companies in the response
        } catch (error) {
            console.error("Error fetching registered companies:", error);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }

    async addManagers(req: Request, res: Response): Promise<Response> {
        console.log("Hitting the addManager Schema 1");
        // const emailFromHeader = req.headers['registered-email'] as string; 
        // console.log("Email from header:", emailFromHeader);
        
        try {
            const hrManagerData = req.body as IManager; // Casting req.body to IManager


            const companyId = (req as any).user?.updatedCompany._id;
            console.log("companyId:", companyId);
            
            await this.businessOwnerService.addManagers(companyId, hrManagerData);
            console.log("Hitting the addManager Schema 5");
            return res.status(201).json({ message: "Successfully added HR Manager" });
        } catch (error) {
            console.error("Error adding HR Manager:", error);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }
}
