import {  Response } from "express";
import { CustomRequest } from "../../middlewares/authMiddleware";

export default interface INotificationController {
    getAllNotifications(req: CustomRequest, res: Response): Promise<Response>;
    deleteNotification(req: CustomRequest, res: Response): Promise<Response>;
    clearAllNotifications(req: CustomRequest, res: Response): Promise<Response>;
}