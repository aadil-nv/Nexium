import React, { useState } from 'react';
import { Switch, Select, Input, Button } from 'antd';
import { ChromePicker } from 'react-color';

const { Option } = Select;

export default function Settings() {
  const [theme, setTheme] = useState('light');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(true);
  const [color, setColor] = useState('#1890ff'); // default color for the theme

  const handleThemeChange = (value) => {
    setTheme(value);
  };

  const handleColorChange = (color) => {
    setColor(color.hex);
  };

  const handleNotificationChange = (type, checked) => {
    if (type === 'email') {
      setEmailNotifications(checked);
    } else if (type === 'sms') {
      setSmsNotifications(checked);
    }
  };

  const toggleTheme = (selectedTheme) => {
    setTheme(selectedTheme);
    // You can apply the theme to the whole app here if needed
    document.body.className = selectedTheme === 'dark' ? 'dark' : 'light';
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>

      {/* Notification Settings */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-2xl font-semibold mb-4">Notification Settings</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Email Notifications</label>
          <Switch
            checked={emailNotifications}
            onChange={(checked) => handleNotificationChange('email', checked)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">SMS Notifications</label>
          <Switch
            checked={smsNotifications}
            onChange={(checked) => handleNotificationChange('sms', checked)}
          />
        </div>
      </div>

      {/* Preferences */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-semibold mb-4">Preferences</h2>

        {/* Theme Buttons */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Theme</label>
          <div className="flex space-x-4">
            <Button
              type={theme === 'light' ? 'primary' : 'default'}
              onClick={() => toggleTheme('light')}
            >
              Light Mode
            </Button>
            <Button
              type={theme === 'dark' ? 'primary' : 'default'}
              onClick={() => toggleTheme('dark')}
            >
              Dark Mode
            </Button>
          </div>
        </div>

        {/* Color Picker */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Theme Color</label>
          <ChromePicker color={color} onChange={handleColorChange} />
        </div>


        {/* Save Settings Button */}
        <div className="mt-6">
          <Button type="primary" className="w-full">
            Save Settings
          </Button>
        </div>
      </div>
    </div>
  );
}
