import { Request, Response } from "express";
import IManagerService from "../../service/interface/IManagerService";
import IManagerController from "../interface/IManagerController";
import { inject, injectable } from "inversify";
import { CustomRequest } from '../../middlewares/tokenAuthenticate'

@injectable()
export default class ManagerController implements IManagerController {
  constructor(
    @inject("IManagerService") private _managerService: IManagerService
  ) {}

  async getManagers(req: Request, res: Response): Promise<Response> {
    try {
      const managers = await this._managerService.getManagers();
      return res.status(200).json(managers);
    } catch (error) {
      return res.status(500).json({ message: "Failed to get managers", error });
    }
  }

  async getManagerPersonalInfo(req: CustomRequest, res: Response): Promise<Response> {

    try {
      const managerId = req?.user?.managerData?._id;
       if (!managerId) {
         return res
           .status(400)
           .json({ message: "Business owner ID not provided in cookies" });
       }

      const managerpersonalinfo = await this._managerService.getManagerPersonalInfo(managerId);

      return res.status(200).json(managerpersonalinfo);
      
    } catch (error) {
      return res.status(500).json({ message: "Failed to get manager personal info", error });

      
    }
  }

  async getManagerProfessionalInfo(req: CustomRequest, res: Response): Promise<Response> {
    try {
      const managerId = req?.user?.managerData?._id;
      if (!managerId) {
        return res
          .status(400)
          .json({ message: "Business owner ID not provided in cookies" });
      }

      const managerProfessionalInfo = await this._managerService.getManagerProfessionalInfo(managerId);
      return res.status(200).json(managerProfessionalInfo);
      
    } catch (error) {
      return res.status(500).json({ message: "Failed to get manager personal info", error });

      
    }
  }

  async getManagerAddress(req: CustomRequest, res: Response): Promise<Response> {
    try {
      const managerId = req?.user?.managerData?._id;
       if (!managerId) {
         return res
           .status(400)
           .json({ message: "Business owner ID not provided in cookies" });
       }


      const managerAddress = await this._managerService.getManagerAddress(managerId);
        
      return res.status(200).json(managerAddress);
      
    } catch (error) {
      return res.status(500).json({ message: "Failed to get manager personal info", error });

      
    }
  }

  async getManagerDocuments(req: CustomRequest, res: Response): Promise<Response> {

    try {
      const managerId = req?.user?.managerData?._id;
       if (!managerId) {
         return res
           .status(400)
           .json({ message: "Business owner ID not provided in cookies" });
       }

      const managerDocuments = await this._managerService.getManagerDocuments(managerId);
      return res.status(200).json(managerDocuments);
      
    } catch (error) {
      return res.status(500).json({ message: "Failed to get manager personal info", error });

      
    }
  }

  async getManagerCredentials(req: CustomRequest, res: Response): Promise<Response> {
    try {
      const managerId = req?.user?.managerData?._id;
       if (!managerId) {
         return res
           .status(400)
           .json({ message: "Business owner ID not provided in cookies" });
       }
      const managerCredentials = await this._managerService.getManagerCredentials(managerId);
      return res.status(200).json(managerCredentials);
      
    } catch (error) {
      return res.status(500).json({ message: "Failed to get manager personal info", error });

      
    }
  }

  async updateManagerPersonalInfo(req: CustomRequest, res: Response): Promise<Response> {
    console.log("hitting manager update personal info==================");
    
    try {

      const managerId = req?.user?.managerData?._id;
      if (!managerId) {
        return res
          .status(400)
          .json({ message: "Business owner ID not provided in cookies" });
      }

     
        const result = await this._managerService.updateManagerPersonalInfo(managerId, req.body);

        console.log("result======from ========update", result);
        

        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({
            message: "Failed to get manager personal info",
            error,
        });
    }
}

  



  
}
