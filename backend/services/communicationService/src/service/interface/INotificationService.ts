import { INotification } from "entities/notificationEntities";
import { INotificationsDTO } from "../../dto/notificationDTO";



export default interface INotificationService {
    getAllNotifications(myId: string): Promise<INotificationsDTO[]>
    saveNotification(userId:string ,message:string,type:string ,title:string):Promise<INotificationsDTO>
    deleteNotification(notificationId: string): Promise<INotificationsDTO | null>
    clearAllNotifications(myId: string): Promise<number>
}