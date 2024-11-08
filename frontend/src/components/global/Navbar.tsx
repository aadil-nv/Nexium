import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setActiveMenu } from "../../features/menuSlice";
import { MdKeyboardArrowDown } from "react-icons/md";
import { TooltipComponent } from "@syncfusion/ej2-react-popups";
import { useNavigate } from "react-router-dom"; 
import { login } from "../../features/businessOwnerSlice";
import { superadminLogin } from "../../features/superAdminSlice";
import useAuth from "../../hooks/useAuth";
import useTheme from "../../hooks/useTheme";
import Alert from "../global/Alert"; // Import Alert component

export default function Navbar() {
  const [showProfileMenu, setShowProfileMenu] = useState(false); 
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false); 
  const { businessOwner, superAdmin } = useAuth();
  const { isActiveMenu, themeColor } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate(); 
  const isBusinessOwner = businessOwner.role;
  const isSuperAdmin = superAdmin.role;

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
        style={{ color: themeColor }} 
      >
        {icon}
      </button>
    </TooltipComponent>
  );

  const handleLogout = () => {
    console.log("User logged out");
    setShowLogoutConfirm(false);
    if (isBusinessOwner) {
      dispatch(login({
        role: '', 
        token: "", 
        isAuthenticated: false,
      }));
      navigate("/login");
    } else if(isSuperAdmin) {
      dispatch(superadminLogin({
        role: '', 
        token: "", 
        isAuthenticated: false,
      }));
      navigate("/superadmin-login");
    }
  };

  return (
    <div
      className={`flex items-center justify-between p-2 h-16 bg-gray-100 text-gray-800 shadow-sm fixed top-0 z-50 transition-all duration-300 ease-in-out ${
        isActiveMenu ? "w-[calc(100%-250px)]" : "w-full"
      }`}
    >
      <NavButton
        title="Menu"
        customFunc={() => dispatch(setActiveMenu(!isActiveMenu))}
        icon={<i className="fi fi-tr-bars-staggered"></i>} 
      />

      <div className="flex items-center space-x-3">
        <NavButton
          title="Announcements"
          customFunc={() => console.log("Announcements clicked")}
          icon={<i className="fi fi-tr-bell"></i>}
        />
        <NavButton
          title="Notifications"
          customFunc={() => console.log("Notifications clicked")}
          icon={<i className="fi fi-tr-light-emergency-on"></i>}
        />

        <div className="relative">
          <button
            type="button"
            className="flex items-center gap-2 cursor-pointer p-1 hover:bg-gray-300 rounded-lg transition-colors duration-300"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
          >
            <img
              src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
              alt="User Profile"
              className="rounded-full w-8 h-8 md:w-9 md:h-9"
            />
            <p className="flex flex-col">
              <span className="from-neutral-100 text-xs md:text-sm" style={{ color: themeColor }}>
                {isBusinessOwner ? "Business Owner" : isSuperAdmin ? "Super Admin" : "User"}
              </span>
            </p>
            <MdKeyboardArrowDown className="text-lg md:text-xl" style={{ color: themeColor }} />
          </button>

          {showProfileMenu && (
            <div
              className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg z-50"
              style={{ borderColor: themeColor }}
            >
              <ul>
                <li
                  className="flex items-center gap-2 p-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => navigate("/profile")}
                  style={{ color: themeColor }}
                >
                  <i className="fi fi-tr-user-gear text-xl"></i>
                  Profile
                </li>
                <li
                  className="flex items-center gap-2 p-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => navigate("/settings")}
                  style={{ color: themeColor }}
                >
                  <i className="fi fi-tr-process text-xl"></i>
                  Settings
                </li>
                <li
                  className="flex items-center gap-2 p-2 hover:bg-red-100 cursor-pointer text-red-500"
                  onClick={() => setShowLogoutConfirm(true)}
                >
                  <i className="fi fi-tr-arrow-left-from-arc"></i>
                  Logout
                </li>
              </ul>
            </div>
          )}
        </div>

        {showLogoutConfirm && (
          <Alert
            message="Are you sure you want to logout?"
            onConfirm={handleLogout}
            onCancel={() => setShowLogoutConfirm(false)}
          />
        )}
      </div>
    </div>
  );
}
