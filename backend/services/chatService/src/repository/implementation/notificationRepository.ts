import { inject, injectable } from "inversify";
import INotificationRepository from "../../repository/interface/INotificationRepository";
import { INotification } from "../../entities/notificationEntities";
import BaseRepository from "./baseRepository";
import mongoose from "mongoose";

@injectable()
export default class NotificationRepository extends BaseRepository<INotification> {
    constructor(@inject("INotification") private _notificationModel: mongoose.Model<INotification>) {
        super(_notificationModel);
    }    

    async getAllNotifications(userId: string): Promise<INotification[]> {
        try {
            const notifications = await this._notificationModel.find({ userId: userId });
            return notifications;
        } catch (error) {
            throw error;
        }
    }
}