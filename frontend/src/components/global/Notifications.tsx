import React, { useState } from 'react';
import useTheme from '../../hooks/useTheme';
import SuccessPage from '../ui/SuccessPage';

export default function Notifications() {
  const { themeColor } = useTheme();
  
  const [notifications, setNotifications] = useState([
    { id: 1, message: 'You have a new message from John Doe.', timestamp: '2024-10-24 10:30 AM' },
    { id: 2, message: 'Your appointment is scheduled for tomorrow at 3 PM.', timestamp: '2024-10-24 09:15 AM' },
    { id: 3, message: 'New comment on your post.', timestamp: '2024-10-23 08:45 PM' },
  ]);

  const [showSuccessPage, setShowSuccessPage] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleDelete = (id: number) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
  };

  const handleSuccessButtonClick = (message: string) => {
    setSuccessMessage(message);  // Set dynamic success message
    setShowSuccessPage(true);  // Show success page
  };

  const closeSuccessPage = () => {
    setShowSuccessPage(false);
    setSuccessMessage('');
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4" style={{ color: themeColor }}>Notifications</h1>
      
      {showSuccessPage && (
        <SuccessPage message={successMessage} onClose={closeSuccessPage} />
      )}

      <div className="space-y-4">
        {notifications.length === 0 ? (
          <p>No notifications available.</p>
        ) : (
          notifications.map(notification => (
            <div key={notification.id} className="border rounded-md p-4 flex justify-between items-center">
              <div>
                <p className="text-gray-800" style={{ color: themeColor }}>{notification.message}</p>
                <p className="text-sm text-gray-500">{notification.timestamp}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleDelete(notification.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                >
                  Delete
                </button>
                <button
                  onClick={() => handleSuccessButtonClick('Notification action was successful!')}
                  className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition"
                >
                  Success
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
