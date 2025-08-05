import { inject, injectable } from "inversify";
import INotificationService from "../interface/INotificationService";
import INotificationRepository from "../../repository/interface/INotificationRepository";
import { INotificationsDTO } from "../../dto/notificationDTO";
import { INotification } from "../../entities/notificationEntities";

@injectable()
export default class NotificationService implements INotificationService {
  constructor(@inject("INotificationRepository") private _notificationRepository: INotificationRepository) { }

  async getAllNotifications(myId: string, businessOwnerId: string): Promise<INotificationsDTO[]> {
    try {
      const notifications: INotification[] = await this._notificationRepository.getAllNotifications(myId, businessOwnerId);

      const mappedNotificationsDTO: INotificationsDTO[] = notifications.map((notification: INotification) => {
        return {
          _id: notification._id,
          userId: notification.userId.toString(),
          title: notification.title,
          message: notification.message,
          type: notification.type,
          isRead: notification.isRead,
        };
      });

      return mappedNotificationsDTO
    } catch (error: any) {
      console.error("Error getting notifications:", error.message);
      throw error;
    }
  }

  async saveNotification(userId: string, message: string, type: string, title: string, businessOwnerId: string): Promise<INotificationsDTO> {

    try {
      const notification: INotification = await this._notificationRepository.saveNotification(userId, message, type, title, businessOwnerId);

      return {
        _id: notification._id,
        userId: notification.userId.toString(),
        title: notification.title,
        message: notification.message,
        type: notification.type,
        isRead: notification.isRead,
      };
    } catch (error: any) {
      throw new Error(`Failed to save notification in service: ${error.message}`);
    }
  }

  async deleteNotification(notificationId: string, businessOwnerId: string): Promise<INotificationsDTO | null> {
    try {
      const notification = await this._notificationRepository.deleteNotification(notificationId, businessOwnerId);

      if (!notification) {
        console.error(`Notification with ID ${notificationId} not found.`);
        throw new Error('Notification not found');
      }

      const formattedNotification: INotificationsDTO = {
        _id: notification._id,
        userId: notification.userId.toString(),
        title: notification.title,
        message: notification.message,
        type: notification.type,
        isRead: notification.isRead,
      };

      return formattedNotification;
    } catch (error) {
      console.error("Error deleting notification:", error);
      throw error;
    }
  }

  async clearAllNotifications(myId: string, businessOwnerId: string): Promise<number> {
    try {
      const result = await this._notificationRepository.clearAllNotifications(myId, businessOwnerId);
      return result.deletedCount || 0;
    } catch (error) {
      console.error("Error clearing notifications:", error);
      throw error;
    }
  }


}
