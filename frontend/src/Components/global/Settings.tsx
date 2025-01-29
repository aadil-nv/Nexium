import { useState } from 'react';
import { Switch, Button } from 'antd';
import { ChromePicker, ColorResult } from 'react-color';

type ThemeType = 'light' | 'dark';
type NotificationType = 'email' | 'sms';

interface SettingsState {
  theme: ThemeType;
  emailNotifications: boolean;
  smsNotifications: boolean;
  color: string;
}

export default function Settings(): JSX.Element {
  const [theme, setTheme] = useState<ThemeType>('light');
  const [emailNotifications, setEmailNotifications] = useState<boolean>(true);
  const [smsNotifications, setSmsNotifications] = useState<boolean>(true);
  const [color, setColor] = useState<string>('#1890ff'); // default color for the theme

  const handleColorChange = (colorResult: ColorResult): void => {
    setColor(colorResult.hex);
  };

  const handleNotificationChange = (type: NotificationType, checked: boolean): void => {
    if (type === 'email') {
      setEmailNotifications(checked);
    } else if (type === 'sms') {
      setSmsNotifications(checked);
    }
  };

  const toggleTheme = (selectedTheme: ThemeType): void => {
    setTheme(selectedTheme);
    // You can apply the theme to the whole app here if needed
    document.body.className = selectedTheme === 'dark' ? 'dark' : 'light';
  };

  const handleSaveSettings = (): void => {
    const settings: SettingsState = {
      theme,
      emailNotifications,
      smsNotifications,
      color,
    };
    // Handle saving settings here
    console.log('Saving settings:', settings);
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
            onChange={(checked: boolean) => handleNotificationChange('email', checked)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">SMS Notifications</label>
          <Switch
            checked={smsNotifications}
            onChange={(checked: boolean) => handleNotificationChange('sms', checked)}
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
          <Button type="primary" className="w-full" onClick={handleSaveSettings}>
            Save Settings
          </Button>
        </div>
      </div>
    </div>
  );
}