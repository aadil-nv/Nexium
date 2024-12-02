
import { Request, Response } from "express";
import { CustomRequest } from "../../middlewares/authMiddleware";

export default interface IManagerController {
  getAllManagers(req: CustomRequest, res: Response): Promise<any>;
  addManagers(req: CustomRequest, res: Response): Promise<any>;
  blockManager(req: CustomRequest, res: Response): Promise<any>;

}
