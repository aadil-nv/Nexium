// controllers/BusinessOwnerController.ts

import { Request, Response } from "express";
import { BusinessOwnerService } from "../../Service/implementation/businessOwnerService";
import { IHRManager } from "../../entities/hrManagerEntity";

export class BusinessOwnerController {
    private businessOwnerService: BusinessOwnerService;
  
    constructor() {
     this.businessOwnerService = new BusinessOwnerService();
    }
  
   async addHRManager(req: Request, res: Response): Promise<Response> {
      console.log("Hitting the addManager Schema 1");
    //   console.log("business-ownerService ",this.businessOwnerService);
      
      
      try {
          console.log("Hitting the addManager Schema 2");
          const hrManagerData: IHRManager = req.body;
          console.log("Hitting the addManager Schema 3");
          console.log("Hr Data is ---->", hrManagerData);
          console.log("Hitting the addManager Schema 4");
          
          await this.businessOwnerService.addHRManagerToCompany(hrManagerData);
          console.log("Hitting the addManager Schema 5");
        return res.status(201).json({ message: "Successfully added HR Manager" });
      } catch (error) {
        console.error("Error adding HR Manager:", error);
        return res.status(500).json({ error: "Internal Server Error" });
      }
    }
  }
  
