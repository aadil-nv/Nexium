import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setActiveMenu } from "../../features/menuSlice";
import { MdKeyboardArrowDown } from "react-icons/md";
import { TooltipComponent } from "@syncfusion/ej2-react-popups";
import { useNavigate } from "react-router-dom";
import { logout as superAdminLogout } from "../../features/superAdminSlice";
import { logout as businessOwnerLogout } from "../../features/businessOwnerSlice";
import useAuth from "../../hooks/useAuth";
import useTheme from "../../hooks/useTheme";
import DropdownMenu from "./DropDown";
import { businessOwnerInstance } from "../../services/businessOwnerInstance";

export default function Navbar() {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const { businessOwner, superAdmin } = useAuth();
  const { isActiveMenu, themeColor } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    setShowLogoutConfirm(false);
    if (businessOwner.isAuthenticated) {
      dispatch(businessOwnerLogout());
      businessOwnerInstance.post("businessOwner/api/manager/logout");
      navigate("/login");
    } else if (superAdmin.isAuthenticated) {
      dispatch(superAdminLogout());
      navigate("/superadmin-login");
    }
  };

  const NavButton = ({ title, customFunc, icon }) => (
    <TooltipComponent content={title} position="BottomCenter">
      <button
        type="button"
        onClick={customFunc}
        className="relative text-xl rounded-full p-1 transition-all duration-300 ease-in-out transform hover:scale-110"
        style={{ color: themeColor }}
      >
        {icon}
      </button>
    </TooltipComponent>
  );

  return (
    <div className={`flex items-center justify-between p-2 h-16 bg-gray-100 shadow-sm fixed top-0 z-50 ${isActiveMenu ? "w-[calc(100%-250px)]" : "w-full"}`}>
      <NavButton title="Menu" customFunc={() => dispatch(setActiveMenu(!isActiveMenu))} icon={<i className="fi fi-tr-bars-staggered"></i>} />

      <div className="flex items-center space-x-3">
        <NavButton title="Announcements" customFunc={() => console.log("Announcements clicked")} icon={<i className="fi fi-tr-bell"></i>} />
        <NavButton title="Notifications" customFunc={() => console.log("Notifications clicked")} icon={<i className="fi fi-tr-light-emergency-on"></i>} />
        
        <div className="relative">
          <button
            type="button"
            className="flex items-center gap-2 p-1 hover:bg-gray-300 rounded-lg transition-colors"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
          >
            <img src="https://cdn-icons-png.flaticon.com/512/149/149071.png" alt="User Profile" className="rounded-full w-8 h-8 md:w-9 md:h-9" />
            <span className="text-xs md:text-sm" style={{ color: themeColor }}>
              {businessOwner.isAuthenticated ? "Business Owner" : superAdmin.isAuthenticated ? "Super Admin" : "User"}
            </span>
            <MdKeyboardArrowDown className="text-lg md:text-xl" style={{ color: themeColor }} />
          </button>

          {showProfileMenu && (
            <DropdownMenu
              themeColor={themeColor}
              onProfileClick={() => navigate("/business-owner/profile")}
              onSettingsClick={() => navigate("/settings")}
              onLogoutClick={() => setShowLogoutConfirm(true)}
            />
          )}
        </div>

        {showLogoutConfirm && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg text-center" style={{ borderColor: themeColor }}>
              <p className="text-lg mb-4" style={{ color: themeColor }}>Are you sure you want to logout?</p>
              <button className="px-4 py-2 rounded mr-2" style={{ backgroundColor: themeColor, color: "white" }} onClick={handleLogout}>
                Yes, Logout
              </button>
              <button className="bg-gray-300 px-4 py-2 rounded" onClick={() => setShowLogoutConfirm(false)}>Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
