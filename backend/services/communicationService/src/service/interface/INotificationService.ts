import { INotificationsDTO } from "../../dto/notificationDTO";



export default interface INotificationService {
    getAllNotifications(myId: string ,businessOwnerId: string): Promise<INotificationsDTO[]>
    saveNotification(userId:string ,message:string,type:string ,title:string ,businessOwnerId: string):Promise<INotificationsDTO>
    deleteNotification(notificationId: string ,businessOwnerId: string): Promise<INotificationsDTO | null>
    clearAllNotifications(myId: string ,businessOwnerId: string): Promise<number>
}