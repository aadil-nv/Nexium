// DropdownMenu.tsx
import React from 'react';
import { IDropdownMenuProps } from '../../interface/GlobalInterface';
import useAuth from '../../hooks/useAuth';

const DropdownMenu: React.FC<IDropdownMenuProps> = ({
  themeColor,
  onLogoutClick,
  onProfileClick,
  onSettingsClick,
  onOptionSelect, // Add new prop for handling menu closure
}) => {
  const { superAdmin } = useAuth();

  // Wrapper functions to handle both the action and menu closure
  const handleProfileClick = () => {
    onProfileClick();
    onOptionSelect();
  };

  const handleSettingsClick = () => {
    onSettingsClick();
    onOptionSelect();
  };

  const handleLogoutClick = () => {
    onLogoutClick();
    onOptionSelect();
  };

  return (
    <div
      className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg z-50"
      style={{ borderColor: themeColor }}
    >
      <ul>
        {!superAdmin?.isAuthenticated && (
          <li
            className="flex items-center gap-2 p-2 hover:bg-gray-100 cursor-pointer"
            onClick={handleProfileClick}
            style={{ color: themeColor }}
          >
            <i className="fi fi-tr-user-gear text-xl"></i>
            Profile
          </li>
        )}
        <li
          className="flex items-center gap-2 p-2 hover:bg-gray-100 cursor-pointer"
          onClick={handleSettingsClick}
          style={{ color: themeColor }}
        >
          <i className="fi fi-tr-process text-xl"></i>
          Settings
        </li>
        <li
          className="flex items-center gap-2 p-2 hover:bg-red-100 cursor-pointer text-red-500"
          onClick={handleLogoutClick}
        >
          <i className="fi fi-tr-arrow-left-from-arc"></i>
          Logout
        </li>
      </ul>
    </div>
  );
};

export default DropdownMenu;