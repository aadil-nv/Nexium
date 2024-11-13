
import { Request, Response } from "express";

export default interface IManagerController {
  getAllManagers(req: Request, res: Response): Promise<any>;
  addManagers(req: any, res: any): Promise<any>;

}
