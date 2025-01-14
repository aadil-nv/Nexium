import mongoose, { Schema, Document } from 'mongoose';

export interface INotification extends Document {
    userId: string; // The user who receives the notification
    title: string; // Title of the notification
    message: string; // Content of the notification
    type: 'info'| 'warning'| 'success' |'error' // Type of notification, e.g., "info", "warning", "success"
    isRead: boolean; // Whether the notification has been read
    createdAt: Date; // Timestamp for when the notification was created
    updatedAt: Date; // Timestamp for when the notification was last updated
  }