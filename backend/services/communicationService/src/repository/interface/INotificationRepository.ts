import BaseRepository from "../../repository/implementation/baseRepository";
import { INotification } from "../../entities/notificationEntities";


export default interface INotificationRepository extends BaseRepository<INotification> {
    getAllNotifications(myId: string ,businessOwnerId: string): Promise<INotification[]>
    saveNotification(userId:string ,message:string,type:string,title:string ,businessOwnerId: string):Promise<INotification>
    clearAllNotifications(myId: string ,businessOwnerId: string): Promise<{ deletedCount?: number }> 
    deleteNotification(notificationId: string ,businessOwnerId: string): Promise<INotification | null> 
}