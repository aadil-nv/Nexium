import mongoose, { Schema} from 'mongoose';
import { INotification } from '../entities/notificationEntities';


const NotificationSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User', // Refers to the User model
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ['info', 'warning', 'success', 'error'], // Allowed types of notifications
      default: 'info',
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

const NotificationModel = mongoose.model<INotification>('Notification', NotificationSchema);

export default NotificationModel;
