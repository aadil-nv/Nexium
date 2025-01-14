import { Request, Response } from "express";
import { CustomRequest } from "../../middlewares/authMiddleware";

export default interface INotificationController {
    getAllNotifications(req: CustomRequest, res: Response): Promise<void>;
}