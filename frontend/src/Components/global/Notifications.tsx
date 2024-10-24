import React, { useState } from 'react';
import { useSelector } from 'react-redux';

export default function Notifications() {
  const currentColor = useSelector((state: { menu: { themeColor: string } }) => state.menu.themeColor);
  
  // Sample notifications data
  const [notifications, setNotifications] = useState([
    { id: 1, message: 'You have a new message from John Doe.', timestamp: '2024-10-24 10:30 AM' },
    { id: 2, message: 'Your appointment is scheduled for tomorrow at 3 PM.', timestamp: '2024-10-24 09:15 AM' },
    { id: 3, message: 'New comment on your post.', timestamp: '2024-10-23 08:45 PM' },
    // Add more notifications as needed
  ]);

  const handleDelete = (id: number) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4" style={{ color: currentColor }}>Notifications</h1>
      <div className="space-y-4">
        {notifications.length === 0 ? (
          <p>No notifications available.</p>
        ) : (
          notifications.map(notification => (
            <div key={notification.id} className="border rounded-md p-4 flex justify-between items-center">
              <div>
                <p className="text-gray-800" style={{ color: currentColor }}>{notification.message}</p>
                <p className="text-sm text-gray-500">{notification.timestamp}</p>
              </div>
              <button
                onClick={() => handleDelete(notification.id)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
