import BaseRepository from "../../repository/implementation/baseRepository";
import { INotification } from "../../entities/notificationEntities";


export default interface INotificationRepository extends BaseRepository<INotification> {
    getAllNotifications(myId: string): Promise<INotification[]>
    saveNotification(userId:string ,message:string,type:string,title:string):Promise<INotification>
    clearAllNotifications(myId: string): Promise<{ deletedCount?: number }> 
    deleteNotification(notificationId: string): Promise<INotification | null> 
}