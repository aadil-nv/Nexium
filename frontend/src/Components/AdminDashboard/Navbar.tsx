import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setActiveMenu } from "../../features/menuSlice";
import { AiOutlineMenu } from "react-icons/ai";
import { TfiAnnouncement } from "react-icons/tfi"; // Importing the announcement icon
import { RiNotification3Line } from "react-icons/ri";
import { MdKeyboardArrowDown } from "react-icons/md";
import { TooltipComponent } from "@syncfusion/ej2-react-popups";

export default function Navbar() {
  const dispatch = useDispatch();
  const activeMenuState = useSelector(
    (state: { menu: { activeMenu: boolean } }) => state.menu.activeMenu
  );
  const currentColor = useSelector((state: { menu: { themeColor: string } }) => state.menu.themeColor); // Get the current color from Redux

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
        style={{ color: currentColor }} // Set icon color to current color
      >
        {icon}
      </button>
    </TooltipComponent>
  );

  return (
    <div
      className={`flex items-center justify-between p-2 h-16 bg-gray-200 text-gray-800 shadow-md fixed top-0 z-50 transition-all duration-300 ease-in-out ${
        activeMenuState ? "w-[calc(100%-250px)]" : "w-full"
      }`}
    >
      {/* Left: Menu button */}
      <NavButton
        title="Menu"
        customFunc={() => dispatch(setActiveMenu(!activeMenuState))}
        icon={<AiOutlineMenu size={24} />} // Increased icon size
      />

      {/* Only show the Navbar if the sidebar is not active or on larger devices */}
      {(!activeMenuState || window.innerWidth > 768) && (
        <div className="flex items-center space-x-3">
          {/* Announcement Icon */}
          <NavButton
            title="Announcements"
            customFunc={() => console.log("Announcements clicked")}
            icon={<TfiAnnouncement size={24} />} // Increased icon size
          />
          {/* Notification Icon */}
          <NavButton
            title="Notifications"
            customFunc={() => console.log("Notifications clicked")}
            icon={<RiNotification3Line size={24} />} // Increased icon size
          />
          {/* User Profile */}
          <TooltipComponent content={"Logout"} position={"BottomCenter"}>
            <div>
              <button
                type="button"
                className="flex items-center gap-2 cursor-pointer p-1 hover:bg-gray-300 rounded-lg transition-colors duration-300" // Adjusted gap and hover style
                onClick={() => console.log("Logout clicked")}
              >
                <img
                  src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
                  alt="User Profile"
                  className="rounded-full w-9 h-9" // Slightly larger profile image
                />
                <p className="flex flex-col">
                  <span className="text-gray-400 text-xs md:text-sm">Hi</span>
                  <span className="text-gray-400 font-bold text-xs md:text-sm">
                    Admin
                  </span>
                </p>
                <MdKeyboardArrowDown className="text-gray-400 text-xl" />{" "}
                {/* Increased arrow icon size */}
              </button>
            </div>
          </TooltipComponent>
        </div>
      )}
    </div>
  );
}
