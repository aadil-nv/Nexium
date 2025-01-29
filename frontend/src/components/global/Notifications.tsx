import React, { useState, useEffect } from 'react';
import { Button, notification } from 'antd';

// Define the structure of a notification object
interface NotificationData {
  key: number;
  message: string;
  description: string;
}

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);

  // Set demo data on initial render
  useEffect(() => {
    const demoNotifications: NotificationData[] = [
      {
        key: Date.now(),
        message: 'New Demo Notification 1',
        description: 'This is the first demo notification for testing purposes.',
      },
      {
        key: Date.now() + 1,
        message: 'New Demo Notification 2',
        description: 'This is the second demo notification for testing purposes.',
      },
    ];
    
    // Add demo notifications to the state
    setNotifications(demoNotifications);

    // Open demo notifications using Ant Design notification API
    demoNotifications.forEach((notificationData) => {
      notification.open({
        message: notificationData.message,
        description: notificationData.description,
        key: notificationData.key,
        onClick: () => {
          console.log('Notification Clicked!');
        },
      });
    });
  }, []);

  const clearNotifications = () => {
    setNotifications([]);
    notification.success({
      message: 'All Notifications Cleared',
    });
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Notifications</h1>

      {/* Clear Notifications Button */}
      <Button type="default" onClick={clearNotifications}>
        Clear Notifications
      </Button>

      {/* Displaying Notifications */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-4">Notifications</h2>
        {notifications.length === 0 ? (
          <p>No notifications yet.</p>
        ) : (
          <ul>
            {notifications.map((notification) => (
              <li key={notification.key} className="mb-2">
                <strong>{notification.message}</strong>
                <p>{notification.description}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Notifications;
