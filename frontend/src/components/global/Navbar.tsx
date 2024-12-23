import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { MdKeyboardArrowDown } from "react-icons/md";
import { Dropdown, Menu, Button, notification } from "antd"; // Import from antd
import useAuth from "../../hooks/useAuth";
import useTheme from "../../hooks/useTheme";
import DropdownMenu from "./DropDown";
import { handleLogout, handleProfileClick, onSettingsClick, NavButton, toggleMenu } from "../../utils/navbarFunctions"; 
import images from "../../images/images";

export default function Navbar() {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const { businessOwner, superAdmin, manager, employee } = useAuth();
  const { isActiveMenu, themeColor } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const defaultProfileImage = "https://cdn.pixabay.com/photo/2018/08/28/12/41/avatar-3637425_1280.png";

  const userName = businessOwner.isAuthenticated? businessOwner?.companyName:
                   superAdmin.isAuthenticated? "Super Admin": 
                   manager.isAuthenticated? manager?.managerName: 
                   employee.isAuthenticated? employee?.employeeName: "Guest";

  const profileImage = businessOwner.isAuthenticated
    ? businessOwner.businessOwnerProfilePicture || defaultProfileImage
    : superAdmin.isAuthenticated
    ? images.superadmin
    : manager.isAuthenticated
    ? manager.managerProfilePicture || defaultProfileImage
    : employee.isAuthenticated
    ? employee.employeeProfilePicture || defaultProfileImage
    : defaultProfileImage;

  const toggleMenuFunc = () => toggleMenu(dispatch, isActiveMenu);
  const handleProfile = () => handleProfileClick({ isBusinessOwner: businessOwner, isSuperAdmin: superAdmin, isManager: manager, isEmployee: employee, dispatch, navigate });
  const handleSettings = () => onSettingsClick({ isBusinessOwner: businessOwner, isSuperAdmin: superAdmin, isManager: manager, isEmployee: employee, dispatch, navigate });
  const handleLogoutAction = () => handleLogout({ isBusinessOwner: businessOwner, isSuperAdmin: superAdmin, isManager: manager, isEmployee: employee, dispatch, navigate });

  // Demo notification data
  const notificationData = [
    { key: "1", message: "New task assigned", description: "You have a new task assigned to you." },
    { key: "2", message: "Reminder: Meeting tomorrow", description: "Don't forget about the meeting tomorrow at 10 AM." },
    { key: "3", message: "System update", description: "The system will undergo maintenance tonight." }
  ];

  // Notification click handler
  const handleNotificationClick = (item: any) => {
    notification.info({
      message: item.message,
      description: item.description,
    });
  };

  // Menu for notifications
  const notificationMenu = (
    <Menu>
      {notificationData.map(item => (
        <Menu.Item key={item.key} onClick={() => handleNotificationClick(item)}>
          {item.message}
        </Menu.Item>
      ))}
    </Menu>
  );

  return (
    <div className={`flex items-center justify-between p-2 h-16 bg-gray-100 shadow-sm fixed top-0 z-50 ${isActiveMenu ? "w-[calc(100%-250px)]" : "w-full"}`}>
      <NavButton title="Menu" customFunc={toggleMenuFunc} icon={<i className="fi fi-tr-bars-staggered" />} themeColor={themeColor} />
      <div className="flex items-center space-x-3">
      <Dropdown overlay={notificationMenu} trigger={['click']}>
          <Button 
            icon={<i className="fi fi-tr-bell" />} 
            style={{
              border: "none", 
              background: "transparent", 
              fontSize: "20px",  // Increase font size
              padding: "8px 16px",  // Increase padding to make button bigger
              color: themeColor,    // Apply theme color to the icon
            }} 
          />
        </Dropdown>
        <Dropdown overlay={notificationMenu} trigger={['click']}>
          <Button 
            icon={<i className="fi fi-tr-megaphone" />} 
            style={{
              border: "none", 
              background: "transparent", 
              fontSize: "20px",  // Increase font size
              padding: "8px 16px",  // Increase padding to make button bigger
              color: themeColor,    // Apply theme color to the icon
            }} 
          />
        </Dropdown>

        <div className="relative">
          <button type="button" className="flex items-center gap-2 p-1 hover:bg-gray-300 rounded-lg" onClick={() => setShowProfileMenu(!showProfileMenu)}>
            <img src={profileImage} alt="Profile" className="rounded-full w-8 h-8 md:w-9 md:h-9" />
            <span className="text-xs md:text-sm" style={{ color: themeColor }}>{userName}</span>
            <MdKeyboardArrowDown className="text-lg md:text-xl" style={{ color: themeColor }} />
          </button>

          {showProfileMenu && (
            <DropdownMenu themeColor={themeColor} onProfileClick={handleProfile} onSettingsClick={handleSettings} onLogoutClick={() => setShowLogoutConfirm(true)} />
          )}
        </div>

        {showLogoutConfirm && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg text-center" style={{ borderColor: themeColor }}>
              <p className="text-lg mb-4" style={{ color: themeColor }}>Are you sure you want to logout?</p>
              <button className="px-4 py-2 rounded mr-2" style={{ backgroundColor: themeColor, color: "white" }} onClick={handleLogoutAction}>Yes, Logout</button>
              <button className="bg-gray-300 px-4 py-2 rounded" onClick={() => setShowLogoutConfirm(false)}>Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
