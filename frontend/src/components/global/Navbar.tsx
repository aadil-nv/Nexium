import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { MdKeyboardArrowDown } from "react-icons/md";
import useAuth from "../../hooks/useAuth";
import useTheme from "../../hooks/useTheme";
import DropdownMenu from "./DropDown";
import { handleLogout, handleProfileClick, onSettingsClick, NavButton, toggleMenu } from "../../utils/navbarFunctions"; 

export default function Navbar() {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const { businessOwner, superAdmin, manager, employee } = useAuth();
  const { isActiveMenu, themeColor } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const defaultProfileImage = "https://cdn.pixabay.com/photo/2018/08/28/12/41/avatar-3637425_1280.png";

  console.log("employee profile picture in navbar:", employee?.employeeProfilePicture);
  

  const userName = businessOwner.isAuthenticated? businessOwner?.companyName:
                   superAdmin.isAuthenticated? "Super Admin": 
                   manager.isAuthenticated? manager?.managerName: 
                   employee.isAuthenticated? employee?.employeeName: "Guest";


                   const profileImage = businessOwner.isAuthenticated
                     ? businessOwner.businessOwnerProfilePicture || defaultProfileImage
                     : superAdmin.isAuthenticated
                     ? "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                     : manager.isAuthenticated
                     ? manager.managerProfilePicture || defaultProfileImage
                     : employee.isAuthenticated
                     ? employee.employeeProfilePicture || defaultProfileImage
                     : defaultProfileImage;
                   

  const toggleMenuFunc = () => toggleMenu(dispatch, isActiveMenu);
  const handleProfile = () => handleProfileClick({ isBusinessOwner: businessOwner, isSuperAdmin: superAdmin, isManager: manager, isEmployee: employee, dispatch, navigate });
  const handleSettings = () => onSettingsClick({ isBusinessOwner: businessOwner, isSuperAdmin: superAdmin, isManager: manager, isEmployee: employee, dispatch, navigate });
  const handleLogoutAction = () => handleLogout({ isBusinessOwner: businessOwner, isSuperAdmin: superAdmin, isManager: manager, isEmployee: employee, dispatch, navigate });

  return (
    <div className={`flex items-center justify-between p-2 h-16 bg-gray-100 shadow-sm fixed top-0 z-50 ${isActiveMenu ? "w-[calc(100%-250px)]" : "w-full"}`}>
      <NavButton title="Menu" customFunc={toggleMenuFunc} icon={<i className="fi fi-tr-bars-staggered" />} themeColor={themeColor} />
      <div className="flex items-center space-x-3">
        <NavButton title="Announcements" customFunc={() => console.log("Announcements clicked")} icon={<i className="fi fi-tr-bell" />} themeColor={themeColor} />
        <NavButton title="Notifications" customFunc={() => console.log("Notifications clicked")} icon={<i className="fi fi-tr-light-emergency-on" />} themeColor={themeColor} />
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
