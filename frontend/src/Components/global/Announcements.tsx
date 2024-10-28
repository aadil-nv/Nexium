import React from 'react';
import useTheme from '../../hooks/useTheme';



export default function Announcements() {
  const { themeColor}=useTheme()

  const announcements = [
    { id: 1, message: 'Company will be closed on Thanksgiving Day.', timestamp: '2024-10-24' },
    { id: 2, message: 'New health insurance plans available for enrollment.', timestamp: '2024-10-22' },
    { id: 3, message: 'Join us for the annual holiday party on December 15!', timestamp: '2024-10-20' },
    
  ];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4" style={{ color: themeColor }}>Announcements</h1>
      <div className="space-y-4">
        {announcements.length === 0 ? (
          <p>No announcements available.</p>
        ) : (
          announcements.map(announcement => (
            <div key={announcement.id} className="border rounded-md p-4 flex flex-col">
              <p className="text-gray-800" style={{ color: themeColor }}>{announcement.message}</p>
              <p className="text-sm text-gray-500">{announcement.timestamp}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
