import { inject, injectable } from "inversify";
import { Request, Response } from "express";
import INotificationService from "../../service/interface/INotificationService";
import INotificationController from "../interface/INotificationController";
import { CustomRequest } from "../../middlewares/authMiddleware";
import { HttpStatusCode } from "../../utils/enum";


@injectable()
export default class NotificationController implements INotificationController {
    constructor(@inject("INotificationService") private _notificationService: INotificationService) { }

    private getMyId(req: CustomRequest): string {
        return (
            req.user?.businessOwnerData?._id ||
            req.user?.managerData?._id ||
            req.user?.employeeData?._id ||
            ''
        );
    }
    private getBusinessOwnerId(req: CustomRequest): string {
        return req.user?.businessOwnerData?._id ||
         req.user?.managerData?.businessOwnerId || 
         req.user?.employeeData?.businessOwnerId || '';
    }
    async getAllNotifications(req: CustomRequest, res: Response): Promise<Response> {
        
        try {
            const myId = this.getMyId(req);
            const businessOwnerId = this.getBusinessOwnerId(req);
            
            const notifications = await this._notificationService.getAllNotifications(myId ,businessOwnerId);
            return res.status(HttpStatusCode.OK).json(notifications);
        } catch (error) {
            console.error(error);
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
        }
    }

    async clearAllNotifications(req: CustomRequest, res: Response): Promise<Response> {
        try {
            const myId = this.getMyId(req);
            const businessOwnerId = this.getBusinessOwnerId(req);
            const notifications = await this._notificationService.clearAllNotifications(myId ,businessOwnerId);
            return res.status(HttpStatusCode.OK).json(notifications);
        } catch (error) {
            console.error(error);
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
        }
    }

    async deleteNotification(req: CustomRequest, res: Response): Promise<Response> {
        try {
            const notificationId = req.params.id;
            const businessOwnerId = this.getBusinessOwnerId(req);            
            const notifications = await this._notificationService.deleteNotification(notificationId ,businessOwnerId);
            return res.status(HttpStatusCode.OK).json(notifications);
        } catch (error) {
            console.error(error);
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
        }
    }

    

}