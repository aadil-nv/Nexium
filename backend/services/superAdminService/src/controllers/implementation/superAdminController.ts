import {Request ,Response} from "express";
import ISuperAdminService from "../../service/interface/ISuperAdminService";  
import { inject, injectable } from "inversify";

@injectable()
export default class SuperAdminController {  
    constructor(@inject("ISuperAdminService") private superAdminService: ISuperAdminService) {} 


    async setNewAccessToken(req: Request, res: Response): Promise<Response> {
        try {
          const result = await this.superAdminService.setNewAccessToken(req.body);
          return res.status(result ? 200 : 400).json(result);
        } catch (error) {    
          console.error("Error in controller:", error);
          return res.status(500).json({ success: false, message: "Internal Server Error" });
        }
      } 

}
