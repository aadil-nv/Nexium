import React from 'react';
import { useSelector } from 'react-redux';

export default function AdminDashboard() {
  // Accessing the theme mode and color from the Redux store
  const themeMode = useSelector((state: { menu: { themeMode: 'light' | 'dark' } }) => state.menu.themeMode);
  const themeColor = useSelector((state: { menu: { themeColor: string } }) => state.menu.themeColor);

  return (
    <div className={`p-4 ${themeMode === 'dark' ? 'bg-black text-white' : 'bg-white text-black'}`}>
      <h1 className="text-xl font-bold">Admin Dashboard</h1>
      <p className="mt-2">Current Theme Mode: <span className="font-semibold">{themeMode}</span></p>
      <p className="mt-2">Current Theme Color: 
        <span 
          className="ml-2 w-5 h-5 inline-block rounded-full" 
          style={{ backgroundColor: themeColor }} 
        />
      </p>
      {/* Add your additional content here */}
      <div>
        {/* Content for the dashboard */}
        Page Dashboard Content Here...
        {/* Example repeated lines for demo purposes */}
        {Array(15).fill('Page Dashboard Content Here...').map((item, index) => (
          <p key={index}>{item}</p>
        ))}
      </div>
    </div>
  );
}
