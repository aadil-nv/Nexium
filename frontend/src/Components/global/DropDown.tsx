import React from 'react';
import { useNavigate } from 'react-router-dom';


interface DropdownMenuProps {
  themeColor: string;
  onLogoutClick: () => void;
  onProfileClick: () => void;
  onSettingsClick: () => void;
}


const DropdownMenu: React.FC<DropdownMenuProps> = ({
  themeColor,
  onLogoutClick,
  onProfileClick,
  onSettingsClick,
}) => {
  return (
    <div
      className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg z-50"
      style={{ borderColor: themeColor }} // Set menu border to current color
    >
      <ul>
        <li
          className="flex items-center gap-2 p-2 hover:bg-gray-100 cursor-pointer"
          onClick={onProfileClick} // Use onProfileClick
          style={{ color: themeColor }} // Apply current theme color
        >
          <i className="fi fi-tr-user-gear text-xl"></i>
          Profile
        </li>
        <li
          className="flex items-center gap-2 p-2 hover:bg-gray-100 cursor-pointer"
          onClick={onSettingsClick} // Use onSettingsClick
          style={{ color: themeColor }} // Apply current theme color
        >
          <i className="fi fi-tr-process text-xl"></i>
          Settings
        </li>
        <li
          className="flex items-center gap-2 p-2 hover:bg-red-100 cursor-pointer text-red-500"
          onClick={onLogoutClick} // Use onLogoutClick
        >
          <i className="fi fi-tr-arrow-left-from-arc"></i>
          Logout
        </li>
      </ul>
    </div>
  );
};



export default DropdownMenu;