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

    async saveNotification(userId: string,message: string,type: string,title: string): Promise<INotification> {
        try {
          const notification = new this._notificationModel({
            userId,
            message,
            type,
            title,
          });
    
          return await notification.save();
        } catch (error:any) {
          throw new Error(`Failed to save notification in repository: ${error.message}`);
        }
      }

      async deleteNotification(notificationId: string): Promise<INotification | null> {
        try {
          const notification = await this._notificationModel.findByIdAndDelete(notificationId);
          return notification; // Returns the deleted notification or null if not found
        } catch (error) {
          console.error("Error deleting notification:", error);
          throw error;
        }
      }
      
      async clearAllNotifications(myId: string): Promise<{ deletedCount?: number }> {
        try {
          const result = await this._notificationModel.deleteMany({ userId: myId });
          return result; // Includes `deletedCount` field indicating the number of documents removed
        } catch (error) {
          console.error("Error clearing notifications:", error);
          throw error;
        }
      }
      
}