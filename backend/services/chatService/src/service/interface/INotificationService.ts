import { INotificationsDTO } from "../../dto/notificationDTO";



export default interface INotificationService {
    getAllNotifications(myId: string): Promise<INotificationsDTO[]>
}