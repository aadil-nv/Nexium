import { inject, injectable } from "inversify";
import { INotification } from "../../entities/notificationEntities";
import BaseRepository from "./baseRepository";
import mongoose from "mongoose";
import connectDB from "../../config/connectDB";

@injectable()
export default class NotificationRepository extends BaseRepository<INotification> {
    constructor(@inject("INotification") private _notificationModel: mongoose.Model<INotification>) {
        super(_notificationModel);
    }    

    async getAllNotifications(userId: string ,businessOwnerId: string): Promise<INotification[]> {    
        try {
          const switchDB = await connectDB(businessOwnerId);
            const notifications = await switchDB.model("notifications" , this._notificationModel.schema).find({ userId: userId });
            return notifications;
        } catch (error) {
            throw error;
        }
    }

    async saveNotification(userId: string,message: string,type: string,title: string ,businessOwnerId: string): Promise<INotification> {
      try {
        const switchDB = await connectDB(businessOwnerId);
        const NotificationModel = switchDB.model("notifications", this._notificationModel.schema);

        const notification = new NotificationModel({
            userId,
            message,
            type,
            title,
        });

        return await notification.save();
    } catch (error: any) {
        throw new Error(`Failed to save notification in repository: ${error.message}`);
    }
      }

      async deleteNotification(notificationId: string ,businessOwnerId: string): Promise<INotification | null> {
        try {
          const switchDB = await connectDB(businessOwnerId);
          const notification = await switchDB.model("notifications", this._notificationModel.schema).findByIdAndDelete(notificationId);
          return notification; // Returns the deleted notification or null if not found
        } catch (error) {
          console.error("Error deleting notification:", error);
          throw error;
        }
      }
      
      async clearAllNotifications(myId: string ,businessOwnerId: string): Promise<{ deletedCount?: number }> {
        try {
          const switchDB = await connectDB(businessOwnerId);
          const result = await switchDB.model("notifications", this._notificationModel.schema).deleteMany({ userId: myId });
          return result; 
        } catch (error) {
          console.error("Error clearing notifications:", error);
          throw error;
        }
      }
      
}