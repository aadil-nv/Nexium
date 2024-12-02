import { Request, Response } from "express";
import IManagerController from "../interface/IManagerController";
import IManagerService from "service/interface/IManagerService";
import { inject, injectable } from "inversify";
import { CustomRequest } from "../../middlewares/authMiddleware";

@injectable()
export default class ManagerController implements IManagerController {
  constructor(@inject("IManagerService") private _managerService: IManagerService) {}

  async addManagers(req: CustomRequest, res: Response): Promise<Response> {
    try {
      const { body: managerData, user } = req;
      const businessOwnerId = user?.businessOwnerData?._id;
      const response = await this._managerService.addManagers(businessOwnerId as string, managerData);
      return res.status(200).json(response);
    } catch (error: any) {
      const errorMessage = error.message || "Internal Server Error. Please try again later.";
      return res.status(error.name === "ValidationError" ? 400 : 500).json({ error: errorMessage });
    }
  }

  async getAllManagers(req: CustomRequest, res: Response): Promise<Response> {
    try {
      const businessOwnerId = req.user?.businessOwnerData?._id;
      const managers = await this._managerService.getAllManagers(businessOwnerId as string);
      return res.status(200).json(managers);
    } catch (error) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  async blockManager(req: CustomRequest, res: Response): Promise<Response> {
    console.log("hitting block manager==========================");
    console.log(req.body);
    
    try {
      const { body: managerData, user } = req;
      const businessOwnerId = user?.businessOwnerData?._id;
      const response = await this._managerService.blockManager(businessOwnerId as string, managerData);
      return res.status(200).json(response);
    } catch (error: any) {
      const errorMessage = error.message || "Internal Server Error. Please try again later.";
      return res.status(error.name === "ValidationError" ? 400 : 500).json({ error: errorMessage });
    }
  }
}
