import { Request, Response } from "express";
import IManagerService from "../../service/interface/IManagerService";
import IManagerController from "../interface/IManagerController";
import { inject, injectable } from "inversify";

@injectable()
export default class ManagerController implements IManagerController {
  constructor(
    @inject("IManagerService") private _managerService: IManagerService
  ) {}

  async getManagers(req: Request, res: Response): Promise<Response> {
    try {
      const dataBaseId = req.cookies.refreshToken;

      if (!dataBaseId) {
        return res
          .status(400)
          .json({ message: "Business owner ID not provided in cookies" });
      }

      await this._managerService.connectDB(dataBaseId);

      const managers = await this._managerService.getManagers();

      return res.status(200).json(managers);
    } catch (error) {
      return res.status(500).json({ message: "Failed to get managers", error });
    }
  }

  async getManagerPersonalInfo(req: Request, res: Response): Promise<Response> {
    console.log(`hitting getManagerPersonalInfo COntroller------------------`.bgWhite);
    try {
      const refreshToken = req.cookies.refreshToken;

      if (!refreshToken) {
        return res
          .status(400)
          .json({ message: "Business owner ID not provided in cookies" });
      }

      await this._managerService.connectDB(refreshToken);

      const managerpersonalinfo = await this._managerService.getManagerPersonalInfo(refreshToken);

      return res.status(200).json(managerpersonalinfo);
      
    } catch (error) {
      return res.status(500).json({ message: "Failed to get manager personal info", error });

      
    }
  }

}
