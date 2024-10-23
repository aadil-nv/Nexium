import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setActiveMenu } from "../../features/menuSlice";
import { AiOutlineMenu } from "react-icons/ai";
import { MdKeyboardArrowDown } from "react-icons/md";
import { TooltipComponent } from "@syncfusion/ej2-react-popups";
import { useNavigate } from "react-router-dom"; // Import for navigation
import { IoNotificationsOutline } from "react-icons/io5";
import { FcSpeaker } from "react-icons/fc";
import { login } from "../../features/businessOwnerSlice";
import { RootState } from "../../store/store";

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Initialize navigation
  const activeMenuState = useSelector(
    (state: { menu: { activeMenu: boolean } }) => state.menu.activeMenu
  );
  const currentColor = useSelector((state: { menu: { themeColor: string } }) => state.menu.themeColor); 

  const [showProfileMenu, setShowProfileMenu] = useState(false); // State for profile menu visibility
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false); // State for logout confirmation modal
  const user= useSelector((state: RootState) => state.businessOwner.role)

  const NavButton = ({
    title,
    customFunc,
    icon,
  }: {
    title: string;
    customFunc: () => void;
    icon: React.ReactElement;
  }) => (
    <TooltipComponent content={title} position="BottomCenter">
      <button
        type="button"
        onClick={customFunc}
        className="relative text-xl rounded-full p-1 transition-all duration-300 ease-in-out transform hover:scale-110"
        style={{ color: currentColor }} // Apply current theme color
      >
        {icon}
      </button>
    </TooltipComponent>
  );

  const handleLogout = () => {
    console.log("User logged out");
    setShowLogoutConfirm(false);
    dispatch(login({
      role: '', // Assuming role is fixed
      token: "", // Assuming the access token is in 'data.accessToken'
      isAuthenticated: false,
    }));
    navigate("/login");
  };

  return (
    <div
      className={`flex items-center justify-between p-2 h-16 bg-gray-100 text-gray-800 shadow-sm fixed top-0 z-50 transition-all duration-300 ease-in-out ${
        activeMenuState ? "w-[calc(100%-250px)]" : "w-full"
      }`}
    >
      {/* Left: Menu button */}
      <NavButton
        title="Menu"
        customFunc={() => dispatch(setActiveMenu(!activeMenuState))}
        icon={<i className="fi fi-tr-bars-staggered"></i>} 
      />

      {/* Right: Icons */}
      <div className="flex items-center space-x-3">
        {/* Announcement Icon */}
        <NavButton
          title="Announcements"
          customFunc={() => console.log("Announcements clicked")}
          icon={<i className="fi fi-tr-bell"></i>} // Responsive icon size
        />
        {/* Notification Icon */}
        <NavButton
          title="Notifications"
          customFunc={() => console.log("Notifications clicked")}
          icon={<i className="fi fi-tr-light-emergency-on"></i>}
        />
        {/* Profile Icon */}
        <div className="relative">
          <button
            type="button"
            className="flex items-center gap-2 cursor-pointer p-1 hover:bg-gray-300 rounded-lg transition-colors duration-300"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
          >
            <img
              src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
              alt="User Profile"
              className="rounded-full w-8 h-8 md:w-9 md:h-9" // Responsive image size
            />
            <p className="flex flex-col">
              <span className="from-neutral-100 text-xs md:text-sm" style={{ color: currentColor }}>
                {user}
              </span>
            </p>
            <MdKeyboardArrowDown className="text-lg md:text-xl" style={{ color: currentColor }} />
          </button>

          {/* Profile Menu */}
          {showProfileMenu && (
            <div
              className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg z-50"
              style={{ borderColor: currentColor }} // Set menu border to current color
            >
              <ul>
                <li
                  className="flex items-center gap-2 p-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => navigate("/profile")} // Navigate to profile page
                  style={{ color: currentColor }} // Apply current theme color
                >
                  <i className="fi fi-tr-user-gear text-xl"></i> {/* Profile icon */}
                  Profile
                </li>
                <li
                  className="flex items-center gap-2 p-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => navigate("/settings")} // Navigate to settings page
                  style={{ color: currentColor }} // Apply current theme color
                >
                  <i className="fi fi-tr-process text-xl"></i> {/* Settings icon */}
                  Settings
                </li>
                <li
                  className="flex items-center gap-2 p-2 hover:bg-red-100 cursor-pointer text-red-500"
                  onClick={() => setShowLogoutConfirm(true)} // Show logout confirmation
                >
                  <i className="fi fi-tr-arrow-left-from-arc"></i> {/* Logout icon */}
                  Logout
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Logout Confirmation Modal */}
        {showLogoutConfirm && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg text-center" style={{ borderColor: currentColor }}>
              <p className="text-lg mb-4" style={{ color: currentColor }}>Are you sure you want to logout?</p>
              <button
                className="px-4 py-2 rounded mr-2"
                style={{ backgroundColor: currentColor, color: "white" }}
                onClick={handleLogout}
              >
                Yes, Logout
              </button>
              <button
                className="bg-gray-300 px-4 py-2 rounded"
                onClick={() => setShowLogoutConfirm(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
