import BaseRepository from "../../repository/implementation/baseRepository";
import { INotification } from "../../entities/notificationEntities";


export default interface INotificationRepository extends BaseRepository<INotification> {
    getAllNotifications(myId: string): Promise<INotification[]>
}