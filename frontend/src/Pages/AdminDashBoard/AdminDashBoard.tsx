import React from "react";
import Sidebar from "../../Components/AdminDashboard/SideBar";
import { FiSettings } from "react-icons/fi";
import { TooltipComponent } from "@syncfusion/ej2-react-popups";
import Navbar from "../../Components/AdminDashboard/Navbar";
import { useSelector } from "react-redux";

const AdminDashBoard = () => {
  const activeMenu = useSelector((state: { menu: { activeMenu: boolean } }) => state.menu.activeMenu);

  return (
    <div className="flex">
      {/* Sidebar */}
      <div className={`fixed h-screen bg-gray-100 text-white z-50 transition-all duration-300 
        ${activeMenu ? 'w-64' : 'w-0 overflow-hidden'}`}>
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className={`flex-1 bg-gray-100 min-h-screen transition-all duration-300 
        ${activeMenu ? 'ml-64' : 'ml-0'}`}>
        {/* Navbar */}
        <div className="w-full z-50">
          <Navbar />
        </div>

        {/* Settings Button */}
        <div className="fixed right-4 bottom-4 z-50">
          <TooltipComponent content="Settings" position="TopCenter">
            <button
              type="button"
              className="text-3xl p-3 hover:drop-shadow-xl bg-blue-500 text-white rounded-full"
            >
              <FiSettings />
            </button>
          </TooltipComponent>
        </div>
      </div>
    </div>
  );
};

export default AdminDashBoard;
