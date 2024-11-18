import { Request, Response } from "express";
import IManagerController from "../interface/IManagerController";
import IManagerService from "service/interface/IManagerService";
import { inject, injectable } from "inversify";

@injectable()
export default class ManagerController implements IManagerController {
  private _managerService: IManagerService;

  constructor(@inject("IManagerService") managerService: IManagerService) {
    this._managerService = managerService;
  }

  async addManagers(req: Request, res: Response): Promise<Response> {
    try {
      const managerData = req.body;
      const businessOwnerId = (req as any).user.businessOwnerData._id;

      const newManagerData = await this._managerService.addManagers(businessOwnerId, managerData);
      return res.status(200).json({ message: "Successfully added Manager", data: newManagerData });
    } catch (error: any) {
      const errorMessage = error.message || "Internal Server Error. Please try again later.";

      if (error.name === "ValidationError") {
        return res.status(400).json({ error: errorMessage });
      }

      return res.status(500).json({ error: errorMessage });
    }
  }

  async getAllManagers(req: Request, res: Response): Promise<Response> {
    try {
      const businessOwnerId = (req as any).user.businessOwnerData._id;
      const managers = await this._managerService.getAllManagers(businessOwnerId);
      
      return res.status(200).json(managers);
    } catch (error) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
}
