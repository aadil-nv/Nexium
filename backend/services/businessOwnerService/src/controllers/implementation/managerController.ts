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

   async getProfile(req: Request, res: Response): Promise<Response> {    
       try {
           const companyId = (req as any).user.updatedCompany._id
           const managerId = (req as any).user?.updatedManager._id;
           const managerProfile =await  this.managerService.getProfile(managerId ,companyId);

           return res.status(201).json(managerProfile)

       } catch (error) {
           console.error("Error fetching manager profile:", error);
           return res.status(500).json({ error: "Internal Server Error" });
       }
    }
}