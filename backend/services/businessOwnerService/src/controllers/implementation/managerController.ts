import { Request, Response } from "express";    
import IManagerController from "../interface/IManagerController";
import IManagerService from "service/interface/IManagerService";
import { inject, injectable } from "inversify";

@injectable()
export default class ManagerController implements IManagerController {
    
    private managerService: IManagerService;
    constructor(@inject("IManagerService") managerService: IManagerService) {
        this.managerService = managerService;
    }
    
    async addManagers(req: any, res: any): Promise<any> {
        console.log("Hitting the addManager from manger controller",);
        try {
            const managerData= req.body 
            const businessOwnerId = (req as any).user.businessOwnerData._id;
 
            console.log("managerData", managerData);
            console.log("businessOwnerId", businessOwnerId);
            
            await this.managerService.addManagers(businessOwnerId, managerData);
            return res.status(201).json({ message: "Successfully added HR Manager" });
        } catch (error) {
            console.error("Error adding HR Manager:", error);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }

    async getAllManagers(req: Request, res: Response): Promise<Response> {
        console.log("Hitting the getAllManagers from manger controller");
        try {

            const businessOwnerId = (req as any).user.businessOwnerData._id;
            console.log("businessOwnerId from controller", businessOwnerId);
            
            const managers = await this.managerService.getAllManagers(businessOwnerId);
       
            return res.status(200).json(managers);
        } catch (error) {
            console.error("Error fetching registered companies:", error);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }

   

}