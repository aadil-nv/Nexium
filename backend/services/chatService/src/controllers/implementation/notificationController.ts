import { inject, injectable } from "inversify";
import { Request, Response } from "express";
import INotificationService from "../../service/interface/INotificationService";
import INotificationController from "../interface/INotificationController";
import { CustomRequest } from "../../middlewares/authMiddleware";
import { HttpStatusCode } from "../../utils/enum";


@injectable()
export default class NotificationController implements INotificationController {
    constructor(@inject("INotificationService") private _notificationService: INotificationService) { }
    async getAllNotifications(req: CustomRequest, res: Response): Promise<void> {
        try {
            const myId = this.getMyId(req);
            const notifications = await this._notificationService.getAllNotifications(myId);
            res.status(HttpStatusCode.OK).json(notifications);
        } catch (error) {
            console.error(error);
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
        }
    }

    private getMyId(req: CustomRequest): string {
        return (
            req.user?.businessOwnerData?._id ||
            req.user?.managerData?._id ||
            req.user?.employeeData?._id ||
            ''
        );
    }

}