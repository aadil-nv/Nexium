
import { Request, Response } from "express";
import { CustomRequest } from "../../middlewares/authMiddleware";

export default interface IManagerController {
  getAllManagers(req: CustomRequest, res: Response): Promise<Response>;
  addManagers(req: CustomRequest, res: Response): Promise<Response>;
  blockManager(req: CustomRequest, res: Response): Promise<Response>;
  getManager(req: CustomRequest, res: Response): Promise<Response>;
  updatePersonalInfo(req: CustomRequest, res: Response): Promise<Response>;
  updateProfessionalInfo(req: CustomRequest, res: Response): Promise<Response>;
  updateAddressInfo(req: CustomRequest, res: Response): Promise<Response>;
  uploadProfilePic(req: CustomRequest, res: Response): Promise<Response>;
  updateResume(req: CustomRequest, res: Response): Promise<Response>;
}