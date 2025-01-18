export interface INotificationsDTO {
      _id: any; // Unique identifier for the notification
      userId: string; // User associated with the notification
      title: string; // Title of the notification
      message: string; // Detailed message of the notification
      type: 'info' | 'warning' | 'success' | 'error'; // Notification type
      isRead: boolean; // Indicates if the notification is read
  }
  